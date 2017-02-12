var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: '#inline-source-map',
  entry: {
    app: ['./client/src/js/index.jsx']
  },
  output: {
    path: path.join(__dirname, '/public/js'),
    publicPath: './js/',
    filename: 'bundle.js'
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /(\.js)|(\.jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: true,
          presets: ['react', 'latest'],
          plugins: ['transform-object-rest-spread']
        }
      }
    ]
  },
  resolve: {
    symlinks: false
  }
}
