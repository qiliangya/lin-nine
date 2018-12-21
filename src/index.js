var fs = require('fs');
var path = require('path')
const tpl = require('../constants/tpl').tpl
var generate = require('babel-generator').default;

const transformTemplate = require('./transform/transformTemplate')

// vue状态
const state = {
  name: undefined,
  data: {},
  props: {},
  computeds: {},
  components: {}
};

module.exports = function() {

  const tast = transformTemplate(tpl, state) // 转化后的template ast树
  
  // 根据ast树 生成源代码
  const inputTemplateCode = generate(tast, {
    quotes: 'single',
    retainLines: true
  })
  
  // 将源代码写入文件
  fs.writeFile(path.join(__dirname , '../dist/input.jsx'), inputTemplateCode.code, function(err){
    if (err) throw err;
    
  })
}