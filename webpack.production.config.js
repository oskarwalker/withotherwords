var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    app: ['./client/src/js/index.jsx']
  },
  output: {
    path: path.join(__dirname, '/public/js'),
    publicPath: './js/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
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
