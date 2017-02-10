const safe = require('server/lib/safe')
const log = require('server/lib/log')

async function replayGame (socket, db, sessionId) {
  // Get current game
  const [gamesCursorError, gamesCursor] = await safe(db
    .table('games')
    .filter(game => game('players').contains(player => player('sessionId').eq(sessionId)))
    .run(db.connection))

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

  if (game.sessionId !== sessionId) {
    socket.emit('gameError', 'Only the owner can replay the game.')
    return
  }

  if (game.status !== 'finished') {
    socket.emit('gameError', 'You can\'t replay the game before it\'s finished.')
    return
  }

  const [updateError] = await safe(db
    .table('games')
    .get(game.id)
    .update({
      status: 'waitingforplayers',
      players: game.players.map(player => Object.assign({}, player, {points: 0})),
      maxTurns: -1,
      currentTurn: -1,
      currentPlayerId: -1
    })
    .run(db.connection))

  if (updateError) {
    log.error(updateError, socket)
  }
}

module.exports = replayGame
