const babylon = require('babylon')
const traverseTree = require('babel-traverse').default;
const tools = require('../utils/tools')
const t = require('babel-types')

// 引入指令转化
const { handleIf, handleShow, handleOn, handleBind, handleFor, handleHtml, handleText } = require('../plugins/directives.js')

/*
* 将vue的template转化成jsx
*/

module.exports = function transformTemplate(tpl, state) {
  let argument = null;
  const definedInFor = []
  // 获取vue转化后的模板
  const templateAst = babylon.parse(tools.formatContent(tpl), {
    plugins: ['jsx'],
    sourceType: 'module'
  })

  // ast代码转化树
  traverseTree(templateAst, {
    ExpressionStatement: {
      exit(path) {
        argument = path.node.expression
      }
    },
    JSXAttribute (path) {
      const node = path.node;
      const value = node.value.value

      if (!node.name) {
        return ;
      }
      const attrName = node.name.name
      if (t.isJSXNamespacedName(node.name)) {
        const namespace = node.name.namespace.name
        if (namespace === 'v-on') {
          handleOn(path, node.name.name.name, value)
        } else if (namespace === 'v-bind') {
          handleBind(path, node.name.name.name, value, state)
        }
        return ;
      }
      switch (attrName) {
        case 'class': {
          path.replaceWith(
            t.jSXAttribute(t.jSXIdentifier('className'), node.value)
          );
          return ;
        }
        case 'v-if': {
          handleIf(path, value, state); break;
        }
        case 'v-show': {
          handleShow(path, value, state); break;
        }
        case 'v-for': {
          handleFor(path, value, definedInFor, state); break;
        }
        case 'v-text': {
          handleText(path, value, state); break;
        }
        case 'v-html': {
          handleHtml(path, value, state); break;
        }
      }

    }
  })

  return argument
}