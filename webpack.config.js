let webpack = require('webpack');

let env = process.env.NODE_ENV;

let root = __dirname;

const config = {
  entry: {
    acfun: `${root}/src/segments/acfun.js`,
    bilibili: `${root}/src/segments/bilibili.js`,
    pptv: `${root}/src/segments/pptv.js`,
    cztv: `${root}/src/segments/cztv.js`,
    le: `${root}/src/segments/le.js`,
    wasu: `${root}/src/segments/wasu.js`,
    sohu: `${root}/src/segments/sohu.js`,
    cntv: `${root}/src/segments/cntv.js`,
    mgtv: `${root}/src/segments/mgtv.js`
  },
  output: {
    filename: '[name].js',
    path: `${root}/dist`,
    library: 'qiguoPlayManage',
    libraryTarget: 'umd'
  },
  externals: {
    request: 'request',
    window: 'window'
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader']
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js'
    }),
  ]
};

if (env === 'production') {
  let otherPlugins = [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      comments: false
    })
  ];
  let allPlugins = otherPlugins.concat(config.plugins);
  config.plugins = allPlugins;
}

module.exports = config;
