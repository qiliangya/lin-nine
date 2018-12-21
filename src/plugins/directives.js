const { getNextJSXElment, getIdentifier } = require('../utils/tools')
const t = require('babel-types')
/*
* 转化指令v-if
* 
*/
exports.handleIf = function(path, value, state) {
  const parentPath = path.parentPath.parentPath;
  // Get JSXElment of v-else
  const nextElement = getNextJSXElment(parentPath);
  const test = state.computeds[value] ? t.identifier(value) : t.memberExpression(
      t.memberExpression(t.thisExpression(), getIdentifier(state, value)),
      t.identifier(value)
  );
  parentPath.replaceWith(
      t.jSXExpressionContainer(
          t.conditionalExpression(
              test,
              parentPath.node,
              nextElement ? nextElement : t.nullLiteral()
          )
      )
  );
  path.remove();
}