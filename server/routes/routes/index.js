const path = require('path')
const fs = require('fs')
const safe = require('server/lib/safe')
const log = require('server/lib/log')
const { ROUND_TIME } = require('server/config')
const { getGameBySession } = require('server/db/game')
const { getPlayerBySession } = require('server/db/player')

module.exports = async function (app, db, req, res) {
  // Prepare to send game-object
  const sessionId = req.sessionId
  const props = {
    game: {},
    player: {},
    config: {
      roundTime: ROUND_TIME,
    }
  }

  if (sessionId) {
    let [gameError, game] = await safe(getGameBySession(sessionId, db))
    
    if (gameError) {
      log.error(gameError)
    }
    props.game = game

    let [playerError, player] = await safe(getPlayerBySession(sessionId, db))
    
    if (playerError) {
      log.error(playerError)
    }
    props.player = player
  }

  new Promise((resolve, reject) => fs.readFile(
    path.join(app.get('baseUrl'), '../client/index_dev.html'),
    'utf8',
    (err, fileContent) => err ? reject(err) : resolve(fileContent)
  ))
  .then(fileContent => fileContent.replace('${reactContent}', '')) // eslint-disable-line no-template-curly-in-string
  .then(fileContent => fileContent.replace('${initialProps}', JSON.stringify(props))) // eslint-disable-line no-template-curly-in-string
  .then(html => res.status(200).send(html))
  .catch(ex => res.status(500).send(ex.message))
}
