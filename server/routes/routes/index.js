const path = require('path')
const fs = require('fs')
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

  new Promise((resolve, reject) => fs.readFile(
    path.join(app.get('baseUrl'), '../client/index_dev.html'),
    'utf8',
    (err, fileContent) => err ? reject(err) : resolve(fileContent)
  ))
  .then(fileContent => fileContent.replace('${reactContent}', ''))
  .then(fileContent => fileContent.replace('${initialProps}', JSON.stringify(props)))
  .then(html => res.status(200).send(html))
  .catch(ex => res.status(500).send(ex.message))
}
