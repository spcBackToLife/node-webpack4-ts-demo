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