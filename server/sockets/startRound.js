const safe = require('server/lib/safe')
const log = require('server/lib/log')
const { getGameBySession, getPlayersByGame, updateGame } = require('server/db/game')
const { getPlayerBySession } = require('server/db/player')

const { ROUND_TIME, ROUND_TIMEOFFSET } = require('server/config')

function getNextCurrentPlayerId (players, currentPlayerId) {
  const currentPlayer = players.find(player => player.id === currentPlayerId)
  const currentPlayerIndex = players.indexOf(currentPlayer)

  // Circular rounds
  if (currentPlayerIndex === players.length - 1) {
    return players.shift().id
  } else {
    return players[currentPlayerIndex + 1].id
  }
}

async function resetGame (socket, db, id) {
  // Get game by id
  const [gameError, game] = await safe(db.table('games').get(id).run(db.connection))
  if (gameError) return log.error(gameError, socket)

  // Get the players of the game
  const [playersError, players] = await safe(getPlayersByGame(db, game.id))
  if (playersError) return log.error(playersError, socket)

  const updateObject = {
    roundEndTime: 0,
    roundStartTime: 0,
    status: 'idle'
  }

  // Should game end?
  if (game.currentTurn === game.maxTurns) {
    updateObject.status = 'finished'
    updateObject.endScore = game.players
  } else {
    // update currentPlayerId for next round
    updateObject.currentPlayerId = getNextCurrentPlayerId(players, game.currentPlayerId)
    updateObject.currentTurn = game.currentTurn + 1
  }

  const [updateGameError] = await safe(updateGame(db, game.id, updateObject))
  if (updateGameError) return log.error(updateGameError, socket)
}

async function startRound (socket, db, sessionId) {
  // get current game
  const [gameError, game] = await safe(getGameBySession(db, sessionId, { privateFields: true }))
  if (gameError) return log.error(gameError, socket)

  if (game === null) {
    socket.emit('gameError', 'You\'re not in a game. Can not start round.')
    return
  }

  // get current player
  const [playerError, player] = await safe(getPlayerBySession(db, sessionId, { privateFields: true }))
  if (playerError) return log.error(playerError, socket)

  if (game.currentPlayerId !== player.id) {
    socket.emit('gameError', 'It\'s not your turn. Can not start round.')
    return
  }

  const [updateError] = await safe(db
    .table('games')
    .filter({id: game.id})
    .update({
      roundEndTime: Date.now() + ROUND_TIME + ROUND_TIMEOFFSET,
      roundStartTime: Date.now() + ROUND_TIMEOFFSET,
      status: 'running'
    })
    .run(db.connection))

  if (updateError) {
    log.error(updateError, socket)
    return
  }

  // Reset game after elapsed game
  setTimeout(resetGame.bind(null, socket, db, game.id), ROUND_TIME + ROUND_TIMEOFFSET)
}

module.exports = startRound
