const { ROUND_TIME } = require('server/config')
const { getGameBySession } = require('server/db/helper/game')
const { getPlayerBySession } = require('server/db/helper/player')

function setupRoutes (app, db, socketio) {
  app.get('/initial-props', async (req, res) => {
    const sessionId = req.sessionId

    const props = {
      game: {},
      player: {},
      config: {}
    }

    if (sessionId) {
      props.game = await getGameBySession(sessionId, db)
      props.player = await getPlayerBySession(sessionId, db)
      props.config = {
        roundTime: ROUND_TIME
      }
    }

    res.status(200).json(props)
  })

  // setup SSR for production (due to caching in development)
  if (app.get('env') !== 'production') {
    const indexRoute = require('./routes/index')
    app.get('/', indexRoute.bind(null, app, db))
  } else {
    const indexRouteProduction = require('./routes/indexProduction')
    app.get('/', indexRouteProduction.bind(null, app, db))
  }
}

module.exports = setupRoutes
