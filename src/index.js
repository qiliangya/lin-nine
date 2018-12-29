const fs = require('fs');
const path = require('path')
const tpl = require('../constants/tpl')
const generate = require('babel-generator').default;
const tools = require('../tools')
const async = require('async');
const babylon = require('babylon');

const { initProps, initData, initComputed, initComponents, initMethods, initRoot, initRender } = require('./transform/transformScript')

const transformTemplate = require('./transform/transformTemplate')



module.exports = function(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    // 获取vue文件解析后的sfc模板
    // 存在 template, script, style
    const SFC_CONTEXT = tools.getSFC(inputPath)

    // js的ast树
    const vast = babylon.parse(SFC_CONTEXT.script, {
      sourceType: 'module',
      plugins: []
    })
    // vue状态模板
    const state = {
      name: undefined,
      data: {
        error: false
      },
      props: {},
      computeds: {},
      components: {}
    };

    // 需要替换的生命周期
    const cycle = {
      'created': 'componentWillMount',
      'mounted': 'componentDidMount',
      'updated': 'componentDidUpdate',
      'beforeDestroy': 'componentWillUnmount',
      'errorCaptured': 'componentDidCatch',
      'render': 'render'
    };

    // 引入的依赖
    const collect = { 
      imports: [],
      classMethods: {}
    };

    initProps(vast, state)
    initData(vast, state);
    initComputed(vast, state);
    initComponents(vast, state);
    initMethods(vast, state, cycle, collect)

    const tast = transformTemplate(SFC_CONTEXT.template, state) // 转化后的template ast树
    

    // 根ast树
    const rast = babylon.parse(tpl(state.name), { sourceType: 'module' })

    initRoot(rast, collect, state, tast)

    initRender(rast, state)

    // 根据ast树 生成源代码
    const inputTemplateCode = generate(rast, {
      quotes: 'single',
      retainLines: true
    })

    const outputDirPath = path.dirname(outputPath)
    
    // 将源代码写入文件
    const templateDir = [
      {
        path: path.join(outputDirPath, 'index.jsx'),
        code: inputTemplateCode.code
      },
      {
        path: path.join(outputDirPath, 'index.scss'),
        code: SFC_CONTEXT.style
      }
    ]
    tools.getFileStatus(outputDirPath)
    .then(stat => {
      if (stat) {
        mkdirReactFile(templateDir).then(res => resolve(res))
      } else {
        fs.mkdir(outputDirPath, function(err) {
          if (err) {
            console.log('创建文件夹失败')
            console.log('错误路径: ' + outputDirPath)
            console.log(err)
            return false;
          }
          mkdirReactFile(templateDir).then(res => resolve(res))
        })
      }
    })
    
  })
  
}

function writeFile(path, code) {
  return function(callback) {
    fs.writeFile(path, code, function(err){
      if (err) console.log(err);
      callback(null, path)
    })
  }
}

function mkdirReactFile(options) {
  if (!path) {
    throw 'The transform must need a path!!'
  }
  let taskList = []
  options.forEach(v => taskList.push(writeFile(v.path, v.code)))
  return new Promise((resolve, reject) => {
    async.parallel(taskList, function(err, result){
      if (err) {
        console.log(err)
      }
      resolve(result)
    })
  })
}