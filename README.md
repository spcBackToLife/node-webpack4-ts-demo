github: `git@github.com:spcBackToLife/node-webpack4-ts-demo.git`

这篇文章主要是帮助大家去集成`Webpack4+node+typescript+hotReload`的环境，而不需要自己再去各种查资料。

## 包含如下内容

- webpack4 + typescripts
- node environment
- nodemon for hot relaod node files

你可以根据以下步骤自己搭建这样的环境，或者是从文章上面的github地址，下载使用这个demo。

## 初始化项目

```
mkdir node-webpack4-ts-demo
cd node-webpack4-ts-demo && npm init # 全部默认，按回车即可
```
会生成一个 `package.json` 文件.
然后你可以创建scr目录并创建main.ts: `src/main.ts`.

## 添加`Typescript`
1. 添加依赖

```
yarn add typescript -D @types/node -D # to recognize the `require`
```
2. 项目根目录下添加ts配置文件: tsconfig.json, 此处默认了一些基础配置，大家可以根据自己需要去看ts文档进行自己需求的配置。

```
{
    "compilerOptions": {
       "strictNullChecks": true,
       "module": "commonjs",
       "esModuleInterop": true,
       "importHelpers": true,
       "allowSyntheticDefaultImports": true,
       "target": "es5",
       "lib": [
        "es2015"
       ]
    },
    "include": [
        "src" // write ts in src, you can define your own dir
    ]
}

```
## 使用`webpack`处理`typescript`
1. 添加`webpack`依赖

```
yarn add webpack webpack-cli babel-loader awesome-typescript-loader source-map-loader -D
```

创建 `webpack.config.js`

```
const path = require('path');
module.exports = {
    mode: 'development',
    // change to .tsx if necessary
    entry: './src/main.ts',
    target: 'node',
    output: {
      filename: './dist/main.js',
      path: path.join(__dirname, '')
    },
    resolve: {
      // changed from extensions: [".js", ".jsx"]
      extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
      rules: [
        { 
          test: /\.ts(x?)$/, use: [
            
            {
              loader: 'babel-loader'
            },
            {
              loader: 'awesome-typescript-loader' 
            }
          ]
        },
        // addition - add source-map support
        { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      ]
    },
    node: {
        __dirname: false, // handle node dirname filename error after pack
        __filename: false
    },
    // addition - add source-map support
    devtool: "source-map"
  }
```

## 使用`babel`处理`node`里的`import`语法
1. 添加依赖
```
yarn add @babel/core @babel/plugin-syntax-dynamic-import @babel/plugin-transform-runtime @babel/preset-env -D
```

2. 创建`.babelrc`文件
```
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "entry"
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-runtime"
  ]
}
```

## 运行node
1. 添加依赖

```
yarn add nodemon ts-node -D
```
2. 运行`node`
  （1）`nodemon`运行的时候，可以监控指定的文件夹下的ts，如果有变化，会自动重新运行node。
  （2）`ts-node` 可以直接运行ts文件，但没有监控文件变化与重启。

  使用`nodemon`需要创建配置文件：`nodemon.json`, 其中`watch`就是需要监控变化的文件夹,本质上流程是：
  启动了`nodemon`，建立了如下配置中对`src`的监控，然后运行`yarn dev`，通过`ts-node`运行ts。
```
{
    "ignore": ["**/*.test.ts", "**/*.spec.ts", ".git", "node_modules"],
    "watch": ["src"],
    "exec": "yarn dev",
    "ext": "ts"
}
```

添加运行命令到 `package.json`

```
# `webpack` the js with entry main.ts and user `nodemon` run the packed js
#  use `nodemon` instead of `node` for hot reloading.
{
    ...
    "hot-dev": "nodemon",
    "dev": "ts-node ./src/main.ts"
    ...
}
```

运行：`yarn hot-dev`则会监控被监控的ts文件自动重新运行。
运行: `yarn dev` 则只会运行ts文件，改动后不会自己重新运行。

如果你想运行打包后的js，则添加如下命令到`package.json`:

```
{
    ...
    "build-dev": "webpack --config webpack.config.dev.js",
    "start-dev": "yarn build-dev && node ./dist/main.js",
    ...
}
```

然后  `yarn start-dev`

最后我们用`express`试一下`nodemon`的重启功能, 首先在`main.ts`写入：

```javascript
  var express = require('express');
  var app = express();
  app.get('/', function (req, res) {
    res.send('Hello world!');
  });
  app.listen(3000);
```
添加Express依赖：`yarn add express`。
运行： `yarn hot-dev`
访问：`http://localhost:3000`, 页面上呈现 `Hello world!`
修改 `Hello world!` 为`Hello world, 秋泽雨!`
再访问：`http://localhost:3000`, 页面上呈现 `Hello world, 秋泽雨!`
热更新成功！


github: `git@github.com:spcBackToLife/node-webpack4-ts-demo.git`
