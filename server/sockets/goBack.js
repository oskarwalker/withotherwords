const safe = require('../lib/safe')

function degradeStatus (socket, db, connection, sessionId, game) {
  switch(game.status) {
    case 'waitingforplayers':
      return degradeWaitingforplayers(...arguments)
    case 'idle':
      return degradeIdle(...arguments)
    case 'running':
      return degradeRunning(...arguments)
    case 'finished':
      return degradeFinished(...arguments)
  }
}

async function leaveOrEndGame (socket, db, connection, sessionId, game) {
   // End game if owner
  if (game.sessionId === sessionId) {
    const [removeError] = await safe(db
      .table('games')
      .get(game.id)
      .delete()
      .run(connection))
  } else {
    // Leave game if not owner
    const [updateError, updateResult] = await safe(db
      .table('games')
      .get(game.id)
      .update({
        players: game.players.filter(player => player.sessionId !== sessionId)
      })
      .run(connection))
  }
}

async function degradeRunning (socket, db, connection, sessionId, game) {
  
  const [playerCursorError, playerCursor] = await safe(db
    .table('games')
    .concatMap(game => game('players'))
    .filter(player => player('sessionId').eq(sessionId))
    .run(connection))

  const [playersError, players] = await safe(playerCursor.toArray())

  const player = players.shift()

  // End turn if current user is the one playing
  if (game.currentPlayerId === player.id) {
    const [updateError] = await safe(db
      .table('games')
      .get(game.id)
      .update({
        roundEndTime: 0,
        roundStartTime: 0,
        status: 'idle'
      })
      .run(connection))
  } else {
    socket.emit('gameError', 'You can not cancel the round right now.')
  }
}

async function degradeWaitingforplayers (socket, db, connection, sessionId, game) {
  leaveOrEndGame(...arguments)
}

async function degradeIdle (socket, db, connection, sessionId, game) {
  leaveOrEndGame(...arguments)
}

async function degradeFinished (socket, db, connection, sessionId, game) {
  leaveOrEndGame(...arguments)
}

async function goBack (socket, db, connection, sessionId) {
  // Get current game
  const [gamesCursorError, gamesCursor] = await safe(db
    .table('games')
    .filter(game => game('players').contains(player => player('sessionId').eq(sessionId)))
    .run(connection))

  if (gamesCursorError) {
    socket.emit('gameError', 'Something went wrong.')
    return
  }

  const [gamesError, games] = await safe(gamesCursor.toArray())

  if (gamesError) {
    socket.emit('gameError', 'Something went wrong.')
    return 
  }

  if (games.length === 0) {
    socket.emit('gameError', 'You\'re not in a game.')
    return 
  }

  const game = games.shift()

  degradeStatus(socket, db, connection, sessionId, game)

}

module.exports = goBack
