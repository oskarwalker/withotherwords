const safe = require('server/lib/safe')
const log = require('server/lib/log')

async function givePoint (socket, db, sessionId) {
  const [gamesCursorError, gamesCursor] = await safe(db
  .table('games')
  .filter(game => game('players').contains(player => player('sessionId').eq(sessionId)))
  .run(db.connection))

  if (gamesCursorError) {
    log.error(gamesCursorError, socket)
    return
  }

  const [gamesError, games] = await safe(gamesCursor.toArray())

  if (gamesError) {
    log.error(gamesError, socket)
    return
  }

  if (games.length === 0) {
    socket.emit('gameError', 'You\'re not in a game. Can not give point.')
  }

  const game = games.shift()

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

  if (updateError) {
    log.error(updateError, socket)
    return
  }
}

module.exports = givePoint
