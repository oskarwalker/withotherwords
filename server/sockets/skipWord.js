const safe = require('server/lib/safe')
const { incrementWordIndex } = require('server/db/game')

async function skipWord (socket, db, sessionId) {
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

  if (game.status !== 'running') {
    socket.emit('gameError', 'The game is not running.')
    return
  }

  const [updateGameError] = await safe(incrementWordIndex(socket, db, game))

  if (updateGameError) {
    socket.emit('gameError', 'Something went wrong.')
    console.log(updateGameError)
    return
  }
}

module.exports = skipWord
