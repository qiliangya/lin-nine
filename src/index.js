const fs = require('fs');
const path = require('path')
const tpl = require('../constants/tpl').tpl
const generate = require('babel-generator').default;
const tools = require('../tools')

const transformTemplate = require('./transform/transformTemplate')



module.exports = function() {
  return new Promise((resolve, reject) => {
    // vue状态
    const state = {
      name: undefined,
      data: {
        error: false
      },
      props: {},
      computeds: {},
      components: {}
    };

    const tast = transformTemplate(tpl, state) // 转化后的template ast树
    
    // 根据ast树 生成源代码
    const inputTemplateCode = generate(tast, {
      quotes: 'single',
      retainLines: true
    })
    
    // 将源代码写入文件

    const inputPath = path.join(__dirname, '../dist')
    tools.getFileStatus(inputPath)
    .then(stat => {
      if (stat) {
        writeJSX(path.join(inputPath , '/input.jsx'), inputTemplateCode.code)
        .then(() => {
          resolve()
        })
      } else {
        fs.mkdir(inputPath, function(err) {
          if (err) {
            console.log('创建文件夹失败')
            return false;
          }
          writeJSX(path.join(inputPath , '/input.jsx'), inputTemplateCode.code)
          .then(() => {
            resolve()
          })
        })
      }
    })
    
  })
  
}

function writeJSX(path, code) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, code, function(err){
      if (err) reject(err);
      console.log('写入成功')
      resolve()
    })
  })
}