'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PWD = process.env.PWD;
var config = {
  module: {
    loaders: [{
      test: /.pug$/,
      loaders: ['pug']
    }]
  },
  plugins: []
};

// build all pug/*.pug with webpack

function loadPugFiles() {
  var files = _fs2.default.readdirSync(_path2.default.join(PWD, '/pug/'));

  var names = [];
  files.forEach(function (file) {
    var splits = file.split('.', 2);
    if (splits[1] === 'pug') {
      names.push(splits[0]);
    }
  });
  names.forEach(function (name) {
    config.plugins.push(new _htmlWebpackPlugin2.default({
      template: _path2.default.join(PWD, 'pug/' + name + '.pug'),
      filename: name + '.html'
    }));
  });
}
loadPugFiles();
exports.default = config;
module.exports = exports['default'];