const path = require('path');

module.exports = {
  mode: 'development',
  entry: './util/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
    library: 'iframeBridge',
    libraryTarget: 'umd'
  }
};