const fs = require('fs');

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
}

module.exports = new Tool()