const safe = require('server/lib/safe')
const log = require('server/lib/log')
const { getGameBySession } = require('server/db/game')

async function setRounds (socket, db, sessionId, rounds = 2) {
  // get current game
  const [gameError, game] = await safe(getGameBySession(db, sessionId, { privateFields: true }))
  if (gameError) return log.error(gameError, socket)

  if (game === null) {
    socket.emit('gameError', 'You\'re not in a game.')
    return
  }

  if (game.sessionId !== sessionId) {
    socket.emit('gameError', 'You\'re not the owner of this game.')
    return
  }

  rounds = parseInt(rounds, 10)
  if (rounds > 8) {
    rounds = 8
  } else if (rounds < 2) {
    rounds = 2
  }

  const [updateError] = await safe(db.table('games')
    .get(game.id)
    .update({
      rounds
    })
    .run(db.connection))

  if (updateError) return log.error(gameError, socket)
}

module.exports = setRounds
