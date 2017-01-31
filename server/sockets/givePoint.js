async function givePoint (socket, db, connection, sessionId) {
  const gamesCursor = await db
  .table('games')
  .filter(game => game('players').contains(player => player('sessionId').eq(sessionId)))
  .run(connection)

  const games = await gamesCursor.toArray()

  if(games.length === 0) {
    socket.emit('gameError', 'You\'re not in a game. Can not give point.')
  }

  const game = games.shift()

  if (
    game.status === 'running' &&
    game.roundEndTime > Date.now()
  ) {
    const currentPlayerId = game.currentPlayerId
    const players = game.players

    const newPlayers = players.map(player => {
      if(player.id === currentPlayerId) {
        return Object.assign({}, player, {
          points: player.points + 1,
        })
      } else {
        return player
      }
    })

    await db
    .table('games')
    .get(game.id)
    .update({players: newPlayers})
    .run(connection)
  } else {
    socket.emit('gameError', 'The round has ended, can\'t give points now.')
  }
}

module.exports = givePoint
