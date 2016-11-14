import path from 'path';
import webpack from 'webpack';
import fs from 'fs';
import HappyPack from 'happypack';
import WriteFilePlugin from 'write-file-webpack-plugin';

function babelLoader(NODE_ENV) {

  const babelrc = fs.readFileSync('./.babelrc');
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

const NODE_ENV  = "development";
const PWD = process.env.PWD;

const jsLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  loaders: []
};

let devtool = 'inline-source-map';

const mainEntry = ['./src/index.js'];
const insDevelopment = NODE_ENV === 'development';

const BASE_DIR =  path.resolve(PWD);
const BUILD_DIR = path.resolve(BASE_DIR, 'dist/');

const plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    __DEVELOPMENT__: insDevelopment,
  }),
  new webpack.IgnorePlugin(/^app-module-path.*/),
];

jsLoader.loaders.push(babelLoader(NODE_ENV));
if (NODE_ENV === 'development' || NODE_ENV === 'test') {
  devtool = 'eval';
}

const envConfig = {};
if (NODE_ENV === 'development') {
  //    jsLoader.loaders.unshift('react-hot');
  mainEntry.push('webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr');
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
  }
}

const modulesDirectories = [
  'src',
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

export default config;
