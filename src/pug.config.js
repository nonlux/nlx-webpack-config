import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const PWD = process.env.PWD;
const config = {
  module: {
    loaders: [
      {
        test: /.pug$/,
        loaders: ['pug'],
      }
    ],
  },
  plugins: []
};

// build all pug/*.pug with webpack
import fs from 'fs';
function loadPugFiles() {
  const files = fs.readdirSync(path.join(PWD, '/pug/'));

  const names = [];
  files.forEach((file) => {
    const splits = file.split('.', 2);
    if (splits[1] === 'pug') {
      names.push(splits[0]);
    }
  });
  names.forEach((name) => {
    config.plugins.push(new HtmlWebpackPlugin({
      template: path.join(PWD, `pug/${name}.pug`),
      filename: `${name}.html`
    }));
  });
}
loadPugFiles();
export default config;
