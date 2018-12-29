#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const program = require('./program')();
const transform = require('../src/index');

let src = program.args[0];
let dist = program.args[1] || process.cwd();

src = path.resolve(process.cwd(), src);
dist = path.resolve(process.cwd(), dist);
const getInputPath = src
const getOutputPath = dist


function init() {
  ergodicDir(getInputPath, getOutputPath)
}

// 遍历文件夹
function ergodicDir(inputPath, outputPath) {
  fs.readdir(inputPath, function(err, files){
    if (err) throw err;
    files.forEach(v => {
      fs.stat(path.join(inputPath, v), function(err, stats) {
        if (err) throw err;
        const IS_FILE = stats.isFile()
        const IS_DIR = stats.isDirectory()
        const transInputPath = path.join(inputPath, v)
        const transOutputPath = path.join(outputPath, v)
        if (IS_FILE) {  // is file
          if (path.extname(v) === '.vue') {
            transform(transInputPath, transOutputPath).then(() => {
              console.log(v + ' 文件转换成功')
            })
          } else {
            return false;
          }
        }
        if (IS_DIR) { // is directory
          ergodicDir(transInputPath, transOutputPath)
        }
      })
    })
  })
}

init()