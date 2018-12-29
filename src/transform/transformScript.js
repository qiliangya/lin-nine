const babelTraverse = require('babel-traverse').default;
const t = require('babel-types');
const { log, parseComponentName } = require('../utils/tools');
const collectVueProps = require('../plugins/vue-props')
const { handleCycleMethods, handleGeneralMethods } = require('../plugins/vue-ast-hand')
const { genClassMethods, genConstructor, genImports, genStaticProps, genSFCRenderMethod } = require('../plugins/react-ast.hand')

exports.initProps = function(ast, state) {
  babelTraverse(ast, {
    Program(path) {
      const nodeLists = path.node.body;
      let count = 0;

      for (let i = 0; i < nodeLists.length; i++) {
        const node = nodeLists[i];
        // const childPath = path.get(`body.${i}`);
        if (t.isExportDefaultDeclaration(node)) {
          count++;
        }
      }

      if (count > 1 || !count) {
        const msg = !count ? 'Must hava one' : 'Only one';
        log(`${msg} export default declaration in youe vue component file`);
        process.exit();
      }
    },

    ObjectProperty(path) {
      const parent = path.parentPath.parent;
      const name = path.node.key.name;
      if (parent && t.isExportDefaultDeclaration(parent)) {
        if (name === 'name') {
          if (t.isStringLiteral(path.node.value)) {
            state.name = path.node.value.value;
          } else {
            log(`The value of name prop should be a string literal.`);
          }
        } else if (name === 'props') {
          collectVueProps(path, state);
          path.stop();
        }
      }
    }
  });
}

exports.initData = function(ast, state) {
  babelTraverse(ast, {
    ObjectMethod (path) {
      const parent = path.parentPath.parent;
      const name = path.node.key.name;

      if (parent && t.isExportDefaultDeclaration(parent)) {
          if (name === 'data') {
              const body = path.node.body.body;
              state.data['_statements'] = [].concat(body);

              let propNodes = {};
              body.forEach(node => {
                  if (t.isReturnStatement(node)) {
                      propNodes = node.argument.properties;
                  }
              });

              propNodes.forEach(propNode => {
                  state.data[propNode.key.name] = propNode.value;
              });
              path.stop();
          }
      }
    }
  });
}

exports.initComputed = function(tast, state) {
  
}

exports.initComponents = function(tast, state) {
  
}

exports.initMethods = function(ast, state, cycle, collect) {
  babelTraverse(ast, {
    ImportDeclaration(path) {
      collect.imports.push(path.node);
    },

    ObjectMethod(path) {
      const name = path.node.key.name;
      if (path.parentPath.parent.key && path.parentPath.parent.key.name === 'methods') {
        handleGeneralMethods(path, collect, state, name);
      } else if (cycle[name]) {
        handleCycleMethods(path, collect, state, name, cycle[name]);
      } else {
        if (name === 'data' || state.computeds[name]) {
          return;
        }
        log(`The ${name} method maybe be not support now`);
      }
    }
  });
}

exports.initRoot = function(ast, collect, state, template) {
  babelTraverse(ast, {
    Program (path) {
        genImports(path, collect, state);
    },

    ClassBody (path) {
        genConstructor(path, state);
        genStaticProps(path, state);
        genClassMethods(path, collect);
        genSFCRenderMethod(path, state, template);
    }
  });
}

exports.initRender = function(ast, state) {
  babelTraverse(ast, {
    ClassMethod(path) {
      if (path.node.key.name === 'render') {
        path.traverse({
          JSXIdentifier(path) {
            if (t.isJSXClosingElement(path.parent) || t.isJSXOpeningElement(path.parent)) {
              const node = path.node;
              const componentName = state.components[node.name] || state.components[parseComponentName(node.name)];
              if (componentName) {
                path.replaceWith(t.jSXIdentifier(componentName));
                path.stop();
              }
            }
          }
        });
      }
    }
  });
}