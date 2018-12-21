const fs = require('fs');
const path = require('path')
const tpl = require('../constants/tpl').tpl
const generate = require('babel-generator').default;

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
    fs.writeFile(path.join(__dirname , '../dist/input.jsx'), inputTemplateCode.code, function(err){
      if (err) reject(err);
      console.log('写入成功')
      resolve()
    })
  })
  
}