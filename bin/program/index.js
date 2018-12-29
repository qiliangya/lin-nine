const program = require('commander');
const chalk = require('chalk');
const pkg = require('../../package.json');

module.exports = function() {
  program
    .version(pkg.version)
    .usage('[options]')
    .option('-i, --input', 'vue的模板输入文件路径, 如果是文件夹则自动转化该文件夹下所有.vue后缀的文件')
    .option('-o, --output', '输出react文件路径, 如果不填则默认输出当前文件夹')
    .parse(process.argv);

  program.on('--help', function () {
      console.log();
      console.log('  Examples:');
      console.log();
      console.log(chalk.gray('    # 能将vue组件转化为react组件'));
      console.log();
      console.log('  使用方式:');
      console.log();
      console.log('    $ nine -i ./components/vue.js -o ./components/');
      console.log();
  }); 

  function help () {
    if (program.args.length < 1) {
        return program.help();
    }
  }
  help();
  return program
}
