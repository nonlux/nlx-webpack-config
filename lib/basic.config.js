'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _happypack = require('happypack');

var _happypack2 = _interopRequireDefault(_happypack);

var _writeFileWebpackPlugin = require('write-file-webpack-plugin');

var _writeFileWebpackPlugin2 = _interopRequireDefault(_writeFileWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function babelLoader(NODE_ENV) {

  var babelrc = _fs2.default.readFileSync('./.babelrc');
  var babelrcObject = {};

  try {
    babelrcObject = JSON.parse(babelrc);
  } catch (err) {
    console.error('==>     ERROR: Error parsing your .babelrc.');
    console.error(err);
  }

  var babelrcEnvObject = babelrcObject.env[NODE_ENV];
  var babelLoaderQuery = (0, _extends3.default)({}, babelrcObject);
  var combinedPlugins = babelrcObject.plugins || [];
  if (babelrcEnvObject) {
    combinedPlugins = combinedPlugins.concat(babelrcEnvObject.plugins);
    babelLoaderQuery = (0, _extends3.default)({}, babelLoaderQuery, babelrcEnvObject, {
      plugins: combinedPlugins,
      cacheDirectory: '.cache/babel'
    });
  }

  return ['babel', (0, _stringify2.default)(babelLoaderQuery)].join('?');
}

var NODE_ENV = "development";
var PWD = process.env.PWD;

var jsLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  loaders: []
};

var devtool = 'inline-source-map';

var mainEntry = ['./src/index.js'];
var insDevelopment = NODE_ENV === 'development';

var BASE_DIR = _path2.default.resolve(PWD);
var BUILD_DIR = _path2.default.resolve(BASE_DIR, 'dist/');

var plugins = [new _webpack2.default.optimize.OccurenceOrderPlugin(), new _webpack2.default.NoErrorsPlugin(), new _webpack2.default.DefinePlugin({
  __DEVELOPMENT__: insDevelopment
}), new _webpack2.default.IgnorePlugin(/^app-module-path.*/)];

jsLoader.loaders.push(babelLoader(NODE_ENV));
if (NODE_ENV === 'development' || NODE_ENV === 'test') {
  devtool = 'eval';
}

var envConfig = {};
if (NODE_ENV === 'development') {
  //    jsLoader.loaders.unshift('react-hot');
  mainEntry.push('webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr');
  plugins.push(new _webpack2.default.HotModuleReplacementPlugin());
  plugins.push(new _happypack2.default({
    loaders: jsLoader.loaders,
    tempDir: '.cache/happypack',
    cachePath: '.cache/happypack/cache--[id].json',
    threads: 4
  }));
  plugins.push(new _writeFileWebpackPlugin2.default());
  jsLoader.loaders = ['happypack/loader'];
  envConfig.devServer = {
    outputPath: BUILD_DIR
  };
}

var modulesDirectories = ['src', 'node_modules'];

var config = (0, _extends3.default)({}, envConfig, {
  devtool: devtool,
  cache: insDevelopment,
  context: BASE_DIR,
  entry: { main: mainEntry
  },
  output: {
    path: BUILD_DIR,
    publicPath: 'js/',
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [jsLoader, { test: /\.json$/, loader: 'json-loader' }]
  },

  resolveLoader: {
    modulesDirectories: modulesDirectories
  },
  resolve: {
    modulesDirectories: modulesDirectories,
    extensions: ['', '.json', '.js', '.jsx']
  },
  plugins: plugins
});

exports.default = config;
module.exports = exports['default'];