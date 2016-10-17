import path from 'path';

const config = {
  entry: {
    main: path.join(__dirname, 'src/index.js'),
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'build'),
  }
};
export default config;
