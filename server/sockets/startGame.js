async function startGame (socket, db, sessionId, rounds = 2) {
  const game = (await db
    .table('games')
    .filter({sessionId})
    .run(db.connection)
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

  const maxTurns = rounds * game.players.length

  db.table('games')
    .get(game.id)
    .update({
      status: 'idle',
      currentPlayerId: currentPlayerId,
      maxTurns,
      currentTurn: 1
    })
    .run(db.connection)
    .catch(err => {
      socket.emit('gameError', 'Could not start game right now.')
      console.log(err)
    })
}

module.exports = startGame
