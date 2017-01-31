async function startGame (socket, db, connection, sessionId) {
  const game = (await db
    .table('games')
    .filter({sessionId})
    .run(connection)
    .then(cursor => cursor.toArray())
    .catch(err => {
      socket.emit('gameError', 'Could not start game right now.')
      console.log(err)
    })
    )[0]

  if (game.sessionId !== sessionId) {
    return
  }

  const currentPlayerId = game.players.find(player => player.sessionId === game.sessionId).id

  db.table('games')
    .get(game.id)
    .update({status: 'idle', currentPlayerId: currentPlayerId})
    .run(connection)
    .catch(err => {
      socket.emit('gameError', 'Could not start game right now.')
      console.log(err)
    })
}

module.exports = startGame
