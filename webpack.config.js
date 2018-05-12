const CopyWebpackPlugin = require('copy-webpack-plugin');
const PostCompile = require('post-compile-webpack-plugin');
const axios = require('axios');

module.exports = {
  entry: ['./src/extension/src/inject/inject.js'],
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/extension/manifest.json', to: '' },
      { from: './src/extension/src/options', to: '' },
      { from: './src/extension/src/bg/background.js', to: '' },
      { from: './src/extension/icons', to: 'icons' }
    ])
  ]
};
