const { getGameBySession } = require('../db/helper/game')

function setupRoutes (app, db, connection, socketio) {
  app.get('/game', async (req, res) => {
    const sessionId = req.sessionId
    let game = {}

    if(sessionId) {
      game = await getGameBySession(sessionId, db, connection)
    }

    res.status(200).json(game)
  })

  // setup SSR for production (due to caching in development)
  if(app.get('env') !== 'production') {
    const indexRoute = require('./routes/index')
    app.get('/', indexRoute.bind(null, app, db, connection))
  } else {
    const indexRouteProduction = require('./routes/indexProduction')
    app.get('/', indexRouteProduction.bind(null, app, db, connection))
  }
}

module.exports = setupRoutes
