const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const each = require('lodash/each');
const map = require('lodash/map');
const glob = require('glob');

const pugPages = ['index', 'other']

const PATHS = {
  entries: __dirname + '/src/js/entries/',
  output: __dirname + '/dist/',
  pug: __dirname + '/src/pug/',
  src: __dirname + "/devBuild",
  nodeModulesPath: path.resolve(__dirname, 'node_modules')
}

function pugPage(name) {
  return new HtmlWebpackPlugin({
    filename: `${name}.html`,
    template: `${PATHS.pug}${name}.pug`,
    inject: false
  })
}

function getPugPages() {
  return map(pugPages, function(page) {
    return pugPage(page);
  })
}

const pug = {
  test: /\.pug$/,
  use: ['html-loader?attrs=false', 'pug-html-loader']
};

const config = {
  entry: {
    app: './src/scripts/app.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'devBuild'),
    publicPath: '/devBuild/',
    filename: 'main.bundle.js'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module', 'browser', 'main'],
    alias: {
      app: path.resolve(__dirname, 'src/scripts/')
    }
  },
  devServer: {
    contentBase: PATHS.src,
    hot: true,
    inline: true,
    historyApiFallback: {
      disableDotRule: true
    },
    stats: 'minimal',
    clientLogLevel: 'warning'
  },
  module: {
    rules: [
      {
        'test': /\.tsx?$/,
        'include': path.resolve(__dirname, 'src/scripts'),
        'loaders': ['babel-loader','ts-loader'],
      },
      pug
    ]
  },
  plugins: [...getPugPages()]
 
};
module.exports = config;