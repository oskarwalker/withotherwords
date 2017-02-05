const safe = require('../lib/safe')
const { incrementWordIndex } = require('../db/helper/game')

async function skipWord (socket, db, connection, sessionId) {
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

  if (game.status !== 'running') {
    socket.emit('gameError', 'The game is not running.')
    return 
  }

  const [updateGameError] = await safe(incrementWordIndex(socket, db, connection, game))

  if (updateGameError) {
    socket.emit('gameError', 'Something went wrong.')
    console.log(updateGameError)
    return
  }
}

module.exports = skipWord
