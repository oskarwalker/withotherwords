const safe = require('server/lib/safe')
const { playerPrivateFields } = require('server/db/player')

const gamePrivateFields = [
  'sessionId',
  {
    players: playerPrivateFields
  }
]

const getGameBySession = (sessionId, db, options = { privateFields: false }) =>
new Promise(async (resolve, reject) => {
  let gamesQuery = db
    .table('games')
    .filter(game => game('players').contains(player => player('sessionId').eq(sessionId)))

  if (options.privateFields !== true) {
    gamesQuery = gamesQuery
      .without(gamePrivateFields)
  }
        
  const [gamesCursorError, gamesCursor] = await safe(gamesQuery.run(db.connection))

  if (gamesCursorError) {
    reject(gamesCursorError)
    return
  }

  const [gamesError, games] = await safe(gamesCursor.toArray())

  if (gamesError) {
    reject(gamesError)
    return
  }
  
  if (games.length > 0) {
    resolve(games.shift())
    return
  }
  
  resolve({})
})

const incrementWordIndex = (sessionId, db, game) => new Promise((resolve, reject) =>
    db
      .table('games')
      .get(game.id)
      .update({
        wordIndex: game.wordIndex + 1
      })
      .run(db.connection))

module.exports = {
  getGameBySession,
  gamePrivateFields,
  incrementWordIndex
}
