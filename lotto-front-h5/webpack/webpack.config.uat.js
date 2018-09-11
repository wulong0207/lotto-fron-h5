const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(baseConfig, {
  module: {
    rules: [
      {
        test: /\.(css|less|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
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
        }) /*, exclude: /user/ */
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        RUNTIME_ENV: JSON.stringify('uat')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({ parallel: true }),
    new ExtractTextPlugin({
      filename: 'css/[name].[chunkhash:8].css',
      disable: false,
      allChunks: true
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        discardComments: { removeAll: true },
        zindex: false
      },
      canPrint: true
    })
  ],
  devtool: 'source-map'
});
