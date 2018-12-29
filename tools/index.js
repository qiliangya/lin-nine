const fs = require('fs');
const compiler = require('vue-template-compiler')

class Tool {
  /**
   *
   *
   * @param {*} path
   * @returns Promise
   * @memberof Tool
   * @description 获取文件路径状态
   */
  getFileStatus (path) {
    return new Promise(function (resolve, reject) {
      fs.stat(path, function(err, stat) {
        if (err) {
          resolve(false)
        } else {
          resolve(stat)
        }
      })
    })
  }

  getSFC (path) {
    const source = fs.readFileSync(path)
    const compilerSFC = compiler.parseComponent(source.toString(), { pad: 'line', pad: 'space' })
    return {
      template: compilerSFC.template.content.replace(/{{/g, '{').replace(/}}/g, '}'),
      script: compilerSFC.script.content.replace(/\/\//g, ''),
      style: compilerSFC.styles[0].content.toString()
    }
  }
}


module.exports = new Tool()