# babel-vue2jsx
将vue的tepmlate语法转化成jsx

## 新增模块
  1. ``` babel-core ``` 用于在node环境中使用babel
  2. ``` babylon ``` 用于解析代码
  3. ``` babel-traverse ``` 用于更新维护ast树, 常和babylon一起使用
  4. ``` babel-types ``` 是一个用于 AST 节点的 Lodash 式工具库 它包含了构造、验证以及变换 AST 节点的方法。 该工具库包含考虑周到的工具方法，对编写处理AST逻辑非常有用
  5. ``` babel-generator ``` Babel Generator模块是 Babel 的代码生成器，它读取AST并将其转换为代码和源码映射（sourcemaps）。

### 真是让人难受啊, babel
  
  下次准备完成main.js里对文件的遍历

### 更新 2018/12/29
  完成I/O文件处理, 加入async模块处理并发文件操作

  加入cmd操作, 可自行配置命令

  -i | --input 输入要转化的文件路径,也可以是文件夹


  -o | --output 输入要输出的文件路径

  新增props data components 等属性转化, 唯一不足在于需要手动格式化文件

### 更新 2018/12/26
  加入文件遍历, 通过bin/main



