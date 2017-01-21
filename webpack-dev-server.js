const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const config = require('./webpack.development.config.js')

config.plugins = config.plugins.concat(
  new webpack.HotModuleReplacementPlugin()
)

config.entry.app.unshift('webpack-dev-server/client?http://localhost:8081/', 'webpack/hot/dev-server')

const compiler = webpack(config)
const server = new WebpackDevServer(compiler, {
  stats: {
    colors: true
  },
  hot: true,
  noInfo: true,
  contentBase: config.output.path,
})
server.listen(8081, 'localhost', (err) => {
  if(err) throw new Error("webpack-dev-server", err)

  console.log('[webpack-dev-server]', 'server running with HMR')
})
