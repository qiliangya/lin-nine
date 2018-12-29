const t = require('babel-types');
const chalk = require('chalk');
/**
 * 将vue的template简写属性 转化为全称, 例如 @ -> v-on : -> v-bind 
 *
 * @param {*} template
 * @returns
 */
function formatContent (template) {
  return template.replace(/{{/g, '{').replace(/}}/g, '}').replace('@','on').replace(/\s(\:.*)(?=\=[\'|\"])/g, v => ' v-bind' + v.trim())
}

function getNextJSXElment (path) {
  let nextElement = null;
  for (let i = path.key + 1; ; i++) {
      const nextPath = path.getSibling(i);
      if (!nextPath.node) {
          break;
      } else if (t.isJSXElement(nextPath.node)) {
          nextElement = nextPath.node;
          nextPath.traverse({
              JSXAttribute (p) {
                  if (p.node.name.name === 'v-else') {
                      p.remove();
                  }
              }
          });
          nextPath.remove();
          break;
      }
  }

  return nextElement;
}

function getIdentifier (state, key) {
  return state.data.hasOwnProperty(key) ? t.identifier('state') : t.identifier('props');
}

function log (msg, type = 'error') {
  if (type === 'error') {
      return console.log(chalk.red(`[nine]: ${msg}`));
  }
  console.log(chalk.green(msg));
};

function parseComponentName (str) {
    if (str) {
        const a = str.split('-').map(e => e[0].toUpperCase() + e.substr(1));
        return a.join('');   
    }
};

function genDefaultProps (props) {
    const properties = [];
    const keys = Object.keys(props).filter(key => typeof props[key].value !== 'undefined');

    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        const obj = props[key];
        const identifier = t.identifier(key);

        let val = t.stringLiteral('error');
        if (obj.type === 'typesOfArray') {
            const type = typeof obj.defaultValue;
            if (type !== 'undefined') {
                const v = obj.defaultValue;
                val = type === 'number' ? t.numericLiteral(Number(v)) : type === 'string' ? t.stringLiteral(v) : t.booleanLiteral(v);
            } else {
                continue;
            }
        } else if (obj.type === 'array') {
            val = t.arrayExpression(obj.value.elements);
        } else if (obj.type === 'object') {
            val = t.objectExpression(obj.value.properties);
        } else {
            switch (obj.type) {
                case 'string':
                    val = t.stringLiteral(obj.value);
                    break;
                case 'boolean':
                    val = t.booleanLiteral(obj.value);
                    break;
                case 'number':
                    val = t.numericLiteral(Number(obj.value));
                    break;
            }
        }

        properties.push(t.objectProperty(identifier, val));
    }

    // Babel does't support to create static class property???
    return t.classProperty(t.identifier('static defaultProps'), t.objectExpression(properties), null, []);
};

function genPropTypes (props) {
    const properties = [];
    const keys = Object.keys(props);

    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        const obj = props[key];
        const identifier = t.identifier(key);

        let val = t.memberExpression(t.identifier('PropTypes'), t.identifier('any'));
        if (obj.type === 'typesOfArray' || obj.type === 'array') {
            if (obj.type === 'typesOfArray') {
                const elements = [];
                obj.value.forEach(val => {
                    elements.push(t.memberExpression(t.identifier('PropTypes'), t.identifier(val)));
                });
                val = t.callExpression(
                    t.memberExpression(t.identifier('PropTypes'), t.identifier('oneOfType')),
                    [t.arrayExpression(elements)]
                );
            } else {
                val = obj.required 
                    ? t.memberExpression(t.memberExpression(t.identifier('PropTypes'), t.identifier('array')), t.identifier('isRequired'))
                    : t.memberExpression(t.identifier('PropTypes'), t.identifier('array'));
            }
        } else if (obj.validator) {
            const node = t.callExpression(
                t.memberExpression(t.identifier('PropTypes'), t.identifier('oneOf')),
                [t.arrayExpression(obj.validator.elements)]
            );
            if (obj.required) {
                val = t.memberExpression(
                    node,
                    t.identifier('isRequired')
                );
            } else {
                val = node;
            }
        } else {
            val = obj.required 
                ? t.memberExpression(t.memberExpression(t.identifier('PropTypes'), t.identifier(obj.type)), t.identifier('isRequired'))
                : t.memberExpression(t.identifier('PropTypes'), t.identifier(obj.type));
        }

        properties.push(t.objectProperty(identifier, val));
    }

    // Babel does't support to create static class property???
    return t.classProperty(t.identifier('static propTypes'), t.objectExpression(properties), null, []);
};

exports.formatContent = formatContent
exports.getNextJSXElment = getNextJSXElment
exports.getIdentifier = getIdentifier
exports.log = log
exports.genDefaultProps = genDefaultProps
exports.genPropTypes = genPropTypes
exports.parseComponentName = parseComponentName

module.exports = {
  formatContent,
  getNextJSXElment,
  getIdentifier,
  log,
  genDefaultProps,
  genPropTypes,
  parseComponentName
}