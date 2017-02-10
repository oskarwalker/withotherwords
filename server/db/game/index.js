const safe = require('server/lib/safe')
const { playerPrivateFields } = require('server/db/player')

const tableName = 'games'

const gamePrivateFields = [
  'sessionId',
  {
    players: playerPrivateFields
  }
]

const updateGame = (db, id, updateProps) =>
new Promise((resolve, reject) =>
  db
    .table(tableName)
    .filter({id})
    .update(updateProps)
    .run(db.connection)
    .then(resolve)
    .catch(reject)
)

const getPlayersByGame = (db, id) =>
new Promise((resolve, reject) =>
  db
    .table(tableName)
    .filter({id})
    .concatMap(game => game('players'))
    .run(db.connection)
    .then(playersCursor => playersCursor.toArray())
    .then(resolve)
    .catch(reject)
)

const getGameBySession = (db, sessionId, options = { privateFields: false }) =>
new Promise(async (resolve, reject) => {
  let gamesQuery = db
    .table(tableName)
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

  resolve(null)
})

const incrementWordIndex = (db, sessionId, game) =>
new Promise((resolve, reject) =>
    db
      .table(tableName)
      .get(game.id)
      .update({
        wordIndex: game.wordIndex + 1
      })
      .run(db.connection)
      .then(resolve)
      .catch(reject)
)

module.exports = {
  getGameBySession,
  gamePrivateFields,
  incrementWordIndex,
  getPlayersByGame,
  updateGame
}
