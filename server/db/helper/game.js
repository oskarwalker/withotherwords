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

module.exports = {
  getGameBySession 
}