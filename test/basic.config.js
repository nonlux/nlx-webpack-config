import path from 'path';

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
    ],
  },
};
export default config;
