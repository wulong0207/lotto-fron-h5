/**
 * Created by yub707
 * date 2017-02-08
 * desc:webpack.config
 */
const path = require('path');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // 入口文件输出配置
  output: {
    // path: path.resolve(__dirname, './build/'),
    path: path.join(__dirname, '../build/'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].js',
    publicPath: '/' // 静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径
  },

  module: {
    // 加载器配置
    rules: [
      // .js 文件使用babel 来编译处理,"babel-loader"也是一个合法的名称,babel5.0预设插件不需要的
      {
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader' }],
        exclude: /node_modules/
      },

      // 图片文件使用 url-loader 来处理，小于8kb的直接转为base64
      {
        test: /\.(png|jpg|gif)$/,
        use: 'url-loader?limit=4096&name=img/[path][name].[ext]'
      },

      // 打包字体
      // {test: /\.(woff|woff2|svg|eot|ttf)\??.*$/, use: 'file?name=../font/[name].[ext]'}
      {
        test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
        use: 'file-loader?prefix=font/&name=font/[name].[ext]'
      }
    ]
  },

  // 其它解决方案配置 自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
  resolve: {
    modules: ['node_modules', path.join(__dirname, '../node_modules')],
    extensions: ['.js', '.jsx', '.json', '.scss'],
    alias: {
      '@': path.join(__dirname, '../lib'),
      lib: path.join(__dirname, '../lib/')
    }
  },

  // 插件项
  plugins: [
    // 动态加载使用的 lodash 模块
    new LodashModuleReplacementPlugin(),

    new webpack.optimize.ModuleConcatenationPlugin(),

    // 共用文件 common.js
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   filename: 'js/common.js'
    // }),

    // 引用公用 dll 文件
    new webpack.DllReferencePlugin({
      manifest: require('../build/js/vendor.dll.manifest.json')
    }),

    // 忽略 moment 中的 locales 语言包
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    // 将 dll 文件应用加加载到 html 文件中
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, '../build/js/*.dll.js'),
      hash: true,
      includeSourcemap: false,
      outputPath: 'js',
      publicPath: '/js'
    }),

    new CopyWebpackPlugin(
      [
        {
          from: path.join(__dirname, '../static'),
          to: path.join(__dirname, '../build/static')
        }
      ],
      {
        copyUnmodified: process.env.RUNTIME === 'development'
      }
    )
  ]
};
