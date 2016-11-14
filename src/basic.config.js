import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const PWD = process.env.PWD;
const config = {
  entry: {
    main: path.join(PWD, 'src/index.js'),
  },
  output: {
    filename: '[name].js',
    path: path.join(PWD, 'dist'),
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loaders: ['babel'],
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },
  plugins: []
};

export default config;
