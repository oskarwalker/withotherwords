const path = require('path')
const fs = require('fs')
const { getGameBySession } = require('../../db/helper/game')

module.exports = async function (app, db, connection, req, res) {
  // Prepare to send game-object
  const sessionId = req.sessionId
  let game = {}

  if(sessionId) {
    game = await getGameBySession(sessionId, db, connection)
  }

  const props = {
    game
  }

  new Promise((resolve, reject) => fs.readFile(
    path.join(app.get('baseUrl'), '../client/src/index.html'),
    'utf8',
    (err, fileContent) => err ? reject(err) : resolve(fileContent)
  ))
  .then(fileContent => fileContent.replace('${reactContent}', ''))
  .then(fileContent => fileContent.replace('${initialProps}', JSON.stringify(props)))
  .then(html => res.status(200).send(html))
  .catch(ex => res.status(500).send(ex.message))
}