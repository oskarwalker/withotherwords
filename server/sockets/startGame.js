const safe = require('server/lib/safe')
const log = require('server/lib/log')
const { getGameBySession } = require('server/db/game')

async function startGame (socket, db, sessionId, rounds = 2) {
  // get current game
  const [gameError, game] = await safe(getGameBySession(db, sessionId, { privateFields: true }))
  if (gameError) return log.error(gameError, socket)

  if (game === null) {
    socket.emit('gameError', 'You\'re not in a game.')
    return
  }

  if (game.players.length < 2) {
    socket.emit('gameError', 'You need at least 2 player to start a game.')
    return
  }

  if (game.sessionId !== sessionId) {
    socket.emit('gameError', 'You\'re not the owner of this game.')
    return
  }


  const currentPlayerId = game.players.find(player => player.sessionId === game.sessionId).id

  const maxTurns = (isNaN(rounds) ? parseInt(rounds, 10) : rounds) * game.players.length

  const [updateError] = await safe(db.table('games')
    .get(game.id)
    .update({
      status: 'idle',
      currentPlayerId,
      maxTurns,
      currentTurn: 1
    })
    .run(db.connection))

  if (updateError) return log.error(gameError, socket)
}

module.exports = startGame
