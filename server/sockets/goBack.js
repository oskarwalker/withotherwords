const safe = require('server/lib/safe')
const log = require('server/lib/log')
const { getGameBySession } = require('server/db/game')

function degradeStatus (socket, db, sessionId, game) {
  switch (game.status) {
    case 'waitingforplayers':
      return degradeWaitingforplayers(...arguments)
    case 'idle':
      return degradeIdle(...arguments)
    case 'running':
      return degradeRunning(...arguments)
    case 'finished':
      return degradeFinished(...arguments)
  }
}

async function leaveOrEndGame (socket, db, sessionId, game) {
   // End game if owner
  if (game.sessionId === sessionId) {
    const [removeError] = await safe(db
      .table('games')
      .get(game.id)
      .delete()
      .run(db.connection))

    if (removeError) {
      log.error(removeError, socket)
      return
    }
  } else {
    // Leave game if not owner
    const [updateError] = await safe(db
      .table('games')
      .get(game.id)
      .update({
        players: game.players.filter(player => player.sessionId !== sessionId)
      })
      .run(db.connection))

    if (updateError) {
      log.error(updateError, socket)
      return
    }
  }
}

async function degradeRunning (socket, db, sessionId, game) {
  const [playerCursorError, playerCursor] = await safe(db
    .table('games')
    .concatMap(game => game('players'))
    .filter(player => player('sessionId').eq(sessionId))
    .run(db.connection))

  if (playerCursorError) {
    log.error(playerCursorError, socket)
    return
  }

  const [playersError, players] = await safe(playerCursor.toArray())

  if (playersError) {
    log.error(playersError, socket)
    return
  }

  const player = players.shift()

  // End turn if current user is the one playing
  if (game.currentPlayerId === player.id) {
    const [updateError] = await safe(db
      .table('games')
      .get(game.id)
      .update({
        roundEndTime: 0,
        roundStartTime: 0,
        status: 'idle'
      })
      .run(db.connection))

    if (updateError) {
      log.error(updateError, socket)
      return
    }
  } else {
    socket.emit('gameError', 'You can not cancel the round right now.')
  }
}

async function degradeWaitingforplayers (socket, db, sessionId, game) {
  leaveOrEndGame(...arguments)
}

async function degradeIdle (socket, db, sessionId, game) {
  leaveOrEndGame(...arguments)
}

async function degradeFinished (socket, db, sessionId, game) {
  leaveOrEndGame(...arguments)
}

async function goBack (socket, db, sessionId) {
  const [gameError, game] = await safe(getGameBySession(db, sessionId, { privateFields: true }))

  if (gameError) {
    log.error(gameError, socket)
    return
  }

  if (game === null) {
    socket.emit('gameError', 'You\'re not in a game.')
    return
  }

  degradeStatus(socket, db, sessionId, game)
}

module.exports = goBack
