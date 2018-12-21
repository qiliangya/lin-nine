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


exports.formatContent = formatContent
exports.getNextJSXElment = getNextJSXElment
exports.getIdentifier = getIdentifier
exports.log = log

module.exports = {
  formatContent,
  getNextJSXElment,
  getIdentifier,
  log
}