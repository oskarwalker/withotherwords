const sanitizer = require('sanitizer')
const safe = require('server/lib/safe')
const log = require('server/lib/log')
const { getGameBySession } = require('server/db/game')

async function joinGame (socket, db, sessionId, code, name) {
  // Sanitize input
  code = sanitizer.sanitize(code)
  name = sanitizer.sanitize(name)

  if (!code) {
    socket.emit('gameError', 'Please provide a game-code to join a game.')
    return
  }

  if (!name) {
    socket.emit('gameError', 'Please provide a team name to join a game.')
    return
  }

  // get game
  const [gameError, game] = await safe(getGameBySession(db, sessionId, { privateFields: true }))
  if (gameError) return log.error(gameError, socket)

  if (game === null) {
    socket.emit('gameError', 'You\'re not part of a game.')
    return
  }

  if (game.players.find(player => player.sessionId === sessionId)) {
    socket.emit('gameError', 'You\'re already in this game.')
    return
  }

  // get uuid for new player
  const [newPlayerIdError, newPlayerId] = await safe(db.uuid().run(db.connection))
  if (newPlayerIdError) return log.error(newPlayerIdError, socket)

  const playerObject = {
    id: newPlayerId,
    sessionId,
    name,
    points: 0
  }

  const [updateError] = await safe(db
    .table('games')
    .filter({id: game.id})
    .update({
      players: db.row('players').append(playerObject)
    })
    .run(db.connection))

  if (updateError) return log.error(updateError, socket, 'Could not join that game right now.')

  socket.emit('player.add', playerObject)
}

module.exports = joinGame
