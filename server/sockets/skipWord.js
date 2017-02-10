const safe = require('server/lib/safe')
const log = require('server/lib/log')
const { getGameBySession, incrementWordIndex } = require('server/db/game')

async function skipWord (socket, db, sessionId) {
  const [gameError, game] = await safe(getGameBySession(db, sessionId, { privateFields: true }))
  if (gameError) return log.error(gameError, socket)

  if (game === null) {
    socket.emit('gameError', 'You\'re not in a game.')
    return
  }

  if (game.status !== 'running') {
    // Drop this silent, no need to notfify player
    // socket.emit('gameError', 'The game is not running.')
    return
  }

  const [updateGameError] = await safe(incrementWordIndex(db, sessionId, game))
  if (updateGameError) return log.error(updateGameError, socket)
}

module.exports = skipWord
