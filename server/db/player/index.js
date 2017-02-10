const safe = require('server/lib/safe')
const playerPrivateFields = ['sessionId']

const getPlayerBySession = (sessionId, db, options = { privateFields: false }) =>
new Promise(async (resolve, reject) => {
  let playersQuery = db
    .table('games')
    .concatMap(game => game('players'))
    .filter(player => player('sessionId').eq(sessionId))

  if (options.privateFields !== true) {
    playersQuery = playersQuery
      .without(playerPrivateFields)
  }
  
  const [playersCursorError, playersCursor] = await safe(playersQuery.run(db.connection))

  if (playersCursorError) {
    reject(playersCursorError)
    return
  }

  const [playersError, players] = await safe(playersCursor.toArray())

  if (playersError) {
    reject(playersError)
    return
  }

  if (players.length > 0) {
    resolve(players.shift())
    return
  }

  resolve({})
})

module.exports = {
  getPlayerBySession,
  playerPrivateFields
}
