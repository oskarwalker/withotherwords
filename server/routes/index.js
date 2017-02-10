const { ROUND_TIME } = require('server/config')
const { getGameBySession } = require('server/db/game')
const { getPlayerBySession } = require('server/db/player')

function setupRoutes (app, db, socketio) {
  app.get('/initial-props', async (req, res) => {
    const sessionId = req.sessionId

    const props = {
      game: {},
      player: {},
      config: {
        roundTime: ROUND_TIME,
      }
    }

    if (sessionId) {
      let [gameError, gameObject] = await safe(getGameBySession(sessionId, db))
    
      if (gameError) {
        log.error(gameError)
      }
      props.game = gameObject

      let [playerError, playerObject] = await safe(getPlayerBySession(sessionId, db))
      
      if (playerError) {
        log.error(playerError)
      }
      props.player = playerObject
    }

    res.status(200).json(props)
  })

  // setup SSR only in production
  if (app.get('env') !== 'production') {
    const indexRoute = require('./routes/index')
    app.get('/', indexRoute.bind(null, app, db))
  } else {
    const indexRouteProduction = require('./routes/indexProduction')
    app.get('/', indexRouteProduction.bind(null, app, db))
  }
}

module.exports = setupRoutes
