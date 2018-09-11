const webpack = require('webpack');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx']
  },
  context: path.join(__dirname, '../lib'),
  entry: {
    vendor: [
      './polyfill',
      'react',
      'react-dom',
      'react-router',
      'axios',
      'prop-types',
      'classnames'
    ]
  },
  output: {
    path: path.join(__dirname, '../build/js'),
    filename: '[name].dll.js',
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../build/js', '[name].dll.manifest.json'),
      name: '[name]_[hash]'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({ parallel: true }),
    new CompressionPlugin({
      test: /\.js/
    })
  ],
  devtool: 'source-map'
};
