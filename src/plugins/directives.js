const { getNextJSXElment, getIdentifier, log } = require('../utils/tools')
const t = require('babel-types')
const eventMap = require('./event-maps')
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

// 显示隐藏
exports.handleShow = function(path, value, state) {
    const test = state.computeds[value] ? t.identifier(value) : t.memberExpression(
        t.memberExpression(t.thisExpression(), getIdentifier(state, value)),
        t.identifier(value)
    );
    path.replaceWith(
        t.jSXAttribute(
            t.jSXIdentifier('style'),
            t.jSXExpressionContainer(
                t.objectExpression([
                    t.objectProperty(
                        t.identifier('display'),
                        t.conditionalExpression(
                            test,
                            t.stringLiteral('block'),
                            t.stringLiteral('none')
                        )
                    )
                ])
            )
        )
    )
}

// 事件转化
exports.handleOn = function (path, name, value) {
    const eventName = eventMap[name];
    // 当找不到事件对应的map时 需要手动添加
    if (!eventName) {
        log(`Can't find the eventName(${name}), you can add transform in the event-maps.js`);
        return;
    }

    path.replaceWith(
        t.jSXAttribute(
            t.jSXIdentifier(eventName),
            t.jSXExpressionContainer(
                t.memberExpression(
                    t.thisExpression(),
                    t.identifier(value)
                )
            )
        )
    );
}