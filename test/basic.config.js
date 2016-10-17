import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config = {
  entry: {
    main: path.join(__dirname, 'src/index.js'),
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'build'),
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loaders: ['babel'],
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /.pug$/,
        loaders: ['pug'],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'pug/index.pug',
    })
  ],
};
export default config;
