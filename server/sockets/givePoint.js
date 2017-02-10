const safe = require('server/lib/safe')
const log = require('server/lib/log')
const { getGameBySession } = require('server/db/game')

async function givePoint (socket, db, sessionId) {
  const [gameError, game] = await safe(getGameBySession(db, sessionId, { privateFields: true }))
  if (gameError) return log.error(gameError, socket)

  if (game === null) {
    // Drop this silent, no need to notfify player
    // socket.emit('gameError', 'You\'re not in a game. Can not give point.')
    return
  }

  if (
    game.status !== 'running' ||
    game.roundEndTime <= Date.now()
  ) {
    socket.emit('gameError', 'The round has ended, can\'t give points now.')
    return
  }

  const currentPlayerId = game.currentPlayerId
  const players = game.players

  const newPlayers = players.map(player => {
    if (player.id === currentPlayerId) {
      return Object.assign({}, player, {
        points: player.points + 1
      })
    } else {
      return player
    }
  })

  const [updateError] = await safe(db
  .table('games')
  .get(game.id)
  .update({players: newPlayers, wordIndex: game.wordIndex + 1})
  .run(db.connection))

  if (updateError) return log.error(updateError, socket)
}

module.exports = givePoint
