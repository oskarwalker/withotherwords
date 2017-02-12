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
  }
}
