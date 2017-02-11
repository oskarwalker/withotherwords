const sanitizer = require('sanitizer')
const safe = require('server/lib/safe')
const log = require('server/lib/log')

async function joinGame (socket, db, sessionId, code, name) {
  // Sanitize input
  code = parseInt(code, 10)
  name = sanitizer.sanitize(name)

  if (!code) {
    socket.emit('gameError', 'Please provide a game-code to join a game.')
    return
  }

  if (!name) {
    socket.emit('gameError', 'Please provide a team name to join a game.')
    return
  }

  // Check if player is in a game already
  const [playerCountError, playerCount] = await safe(db
    .table('games')
    .filter(db.row('players').contains(player => player('sessionId').eq(sessionId)))
    .count()
    .run(db.connection))

  if (playerCountError) return log.error(playerCountError, socket)

  if (playerCount > 0) {
    socket.emit('gameError', 'You\'re already in a game.')
    return
  }

  // If game is not waiting for players, don't add player
  const [gamesError, games] = await safe(db
    .table('games')
    .filter({code})
    .pluck('id', 'status')
    .run(db.connection)
    .then(cursor => cursor.toArray()))

  if (gamesError) return log.error(gamesError, socket)

  if (games.length < 1) {
    socket.emit('gameError', 'That code does not work.')
    return
  }

  const game = games.shift()

  if (game.status !== 'waitingforplayers') {
    socket.emit('gameError', 'That game is already running.')
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

  // Insert new player
  const [updateError] = await safe(db
    .table('games')
    .get(game.id)
    .update({
      players: db.row('players').append(playerObject)
    })
    .run(db.connection))

  if (updateError) return log.error(updateError, socket, 'Could not join that game right now.')

  socket.emit('player.add', playerObject)
}

module.exports = joinGame
