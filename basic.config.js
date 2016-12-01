import path from 'path';
import webpack from 'webpack';
import fs from 'fs';
import HappyPack from 'happypack';
import WriteFilePlugin from 'write-file-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import CleanPlugin from 'clean-webpack-plugin';
import NpmInstallPlugin from 'npm-install-webpack-plugin';

const NODE_ENV = 'development';
let PWD = process.env.PWD;

function detectRoot(dir) {
  try {
    fs.accessSync(path.join(dir, 'package.json'));
    return dir;
  } catch (error) {
    return detectRoot(path.join(dir, '..'));
  }
}
PWD = detectRoot(PWD);

function babelLoader() {
  const babelrc = fs.readFileSync(`${PWD}/.babelrc`);
  let babelrcObject = {};

  try {
    babelrcObject = JSON.parse(babelrc);
  } catch (err) {
    console.error('==>     ERROR: Error parsing your .babelrc.');
    console.error(err);
  }

  const babelrcEnvObject = babelrcObject.env[NODE_ENV];
  let babelLoaderQuery = { ...babelrcObject };
  let combinedPlugins = babelrcObject.plugins || [];
  if (babelrcEnvObject) {
    combinedPlugins = combinedPlugins.concat(babelrcEnvObject.plugins);
    babelLoaderQuery = {
      ...babelLoaderQuery,
      ...babelrcEnvObject,
      plugins: combinedPlugins,
      cacheDirectory: '.cache/babel',
    };
  }

  return ['babel', JSON.stringify(babelLoaderQuery)].join('?');
}
const jsLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  loaders: []
};

let devtool = 'inline-source-map';

const mainEntry = ['./src/index.js'];
const insDevelopment = NODE_ENV === 'development';

const BASE_DIR = path.resolve(PWD);
const BUILD_DIR = path.resolve(BASE_DIR, 'dist/');
const STATIC_DIR = path.resolve(BASE_DIR, 'static/');

const CopyStatic = { from: STATIC_DIR, to: BUILD_DIR };
const CopyBootstrap = {
  from: path.resolve(BASE_DIR, 'bower_components/bootstrap/dist/css'),
  to: path.resolve(BUILD_DIR, 'css')
};
const plugins = [
  new CleanPlugin([BUILD_DIR]),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    __DEVELOPMENT__: insDevelopment,
  }),
  new webpack.IgnorePlugin(/^app-module-path.*/),
  new CopyPlugin([
    CopyStatic,
    CopyBootstrap,
    ]),
  new NpmInstallPlugin(),
];

jsLoader.loaders.push(babelLoader(NODE_ENV));
if (NODE_ENV === 'development' || NODE_ENV === 'test') {
  devtool = 'eval';
}

const PORT = 8080;
const envConfig = {};
if (NODE_ENV === 'development') {
  //    jsLoader.loaders.unshift('react-hot');
  // mainEntry.push(`webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr`);
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new HappyPack({
    loaders: jsLoader.loaders,
    tempDir: '.cache/happypack',
    cachePath: '.cache/happypack/cache--[id].json',
    threads: 4,
  }));
  plugins.push(new WriteFilePlugin());
  jsLoader.loaders = ['happypack/loader'];
  envConfig.devServer = {
    outputPath: BUILD_DIR,
    contentBase: BUILD_DIR,
    hot: true
  };
}

const modulesDirectories = [
  'src',
  'src/common',
  'node_modules'
];

const config = {
  ...envConfig,
  devtool,
  cache: insDevelopment,
  context: BASE_DIR,
  entry: { main: mainEntry,
  },
  output: {
    path: BUILD_DIR,
    publicPath: 'js/',
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [
      jsLoader,
      { test: /\.json$/, loader: 'json-loader' },
    ]
  },

  resolveLoader: {
    modulesDirectories,
  },
  resolve: {
    modulesDirectories,
    extensions: ['', '.json', '.js', '.jsx']
  },
  plugins
};

console.log(config);
export default config;
