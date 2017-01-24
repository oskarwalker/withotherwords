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
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  module: {
    loaders: [
      {
        test: /(\.js)|(\.jsx)$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['react', 'latest'],
          plugins: ['transform-object-rest-spread']
        }
      }
    ]
  }
}
