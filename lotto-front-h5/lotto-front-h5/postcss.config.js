const px2rem = require('postcss-px2rem');

module.exports = {
  plugins: [
    require('autoprefixer'),
    px2rem({remUnit: 75/*, threeVersion: true*/})
  ]
}