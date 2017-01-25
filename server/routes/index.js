const path = require('path')
const fs = require('fs')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const App = require('../../client/src/js/components/App.jsx')

async function getGameBySession(sessionId, db, connection) {
  const gamePublicFields = ['code', 'status', 'players']

  const gamesCursor = await db
        .table('games')
        .filter(game => game('players').contains(player => player('sessionId').eq(sessionId)))
        .withFields(gamePublicFields)
        .run(connection)

  const games = await gamesCursor.toArray()
  if(games.length > 0) {
    return games[0]
  }
  return {}
}

function setupRoutes (app, db, connection, socketio) {
  app.get('/game', async (req, res) => {
    const sessionId = req.sessionId
    let game = {}

    if(sessionId) {
      game = await getGameBySession(sessionId, db, connection)
    }

    res.status(200).json(game)
  })

  app.get('/', async (req, res) => {
    // Prepare to send game-object
    const sessionId = req.sessionId
    let game = {}

    if(sessionId) {
      game = await getGameBySession(sessionId, db, connection)
    }

    const props = {
      game
    }

    //Render with react and send html
    const reactContent = ReactDOMServer.renderToString(React.createElement(App, props))

    new Promise((resolve, reject) => fs.readFile(
      path.join(app.get('baseUrl'), '../client/src/index.html'),
      'utf8',
      (err, fileContent) => err ? reject(err) : resolve(fileContent)
    ))
    .then(fileContent => fileContent.replace('${reactContent}', reactContent))
    .then(fileContent => fileContent.replace('${initialProps}', JSON.stringify(props)))
    .then(html => res.status(200).send(html))
    .catch(ex => res.status(500).send("Something went wrong"))
  })
}

module.exports = setupRoutes
