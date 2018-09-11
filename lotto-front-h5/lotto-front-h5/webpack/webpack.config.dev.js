const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');
const webpack = require('webpack');
const config = require('../scripts/config');

module.exports = merge(baseConfig, {
  entry: {
    common: ['webpack-dev-server/client?http://localhost:' + config.port + '/']
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin({ profile: true }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: `js/common.js`
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        RUNTIME_ENV: JSON.stringify('dev'),
        DEV_SERVER_PORT: config.port
      }
    })
  ],
  devtool: 'cheap-module-eval-source-map'
});
