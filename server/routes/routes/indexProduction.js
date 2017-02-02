const path = require('path')
const fs = require('fs')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const App = require('../../../client/src/js/components/App.jsx')
const { ROUND_TIME } = require('../../config')
const { getGameBySession } = require('../../db/helper/game')
const { getPlayerBySession } = require('../../db/helper/player')

module.exports = async function (app, db, connection, req, res) {
  // Prepare to send game-object
  const sessionId = req.sessionId
  let game = {}
  let player = {}

  if (sessionId) {
    game = await getGameBySession(sessionId, db, connection)
    player = await getPlayerBySession(sessionId, db, connection)
  }

  const props = {
    game,
    player,
    config: {
      roundTime: ROUND_TIME
    }
  }

  // Render with react and send html
  const reactContent = ReactDOMServer.renderToString(React.createElement(App, props))

  new Promise((resolve, reject) => fs.readFile(
    path.join(app.get('baseUrl'), '../client/src/index.html'),
    'utf8',
    (err, fileContent) => err ? reject(err) : resolve(fileContent)
  ))
  .then(fileContent => fileContent.replace('${reactContent}', reactContent))
  .then(fileContent => fileContent.replace('${initialProps}', JSON.stringify(props)))
  .then(html => res.status(200).send(html))
  .catch(ex => res.status(500).send('Something went wrong'))
}
