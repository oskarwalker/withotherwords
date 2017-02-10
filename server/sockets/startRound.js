const safe = require('server/lib/safe')
const log = require('server/lib/log')

const { ROUND_TIME, ROUND_TIMEOFFSET } = require('../config')

async function startRound (socket, db, connection, sessionId, code) {
  if (code === undefined) {
    socket.emit('gameError', 'You need specify the game\'s code to start round')
    return
  }

  const [currentPlayerIdCursorError, currentPlayerIdCursor] = await safe(db
    .table('games')
    .filter({code})
    .withFields(['currentPlayerId'])
    .run(connection))

  if (currentPlayerIdCursorError) {
    log.error(currentPlayerIdCursorError, socket)
    return
  }

  const [currentPlayersError, currentPlayers] = await safe(currentPlayerIdCursor.toArray())

  if (currentPlayersError) {
    log.error(currentPlayersError, socket)
    return
  }

  const currentPlayerId = currentPlayers.shift().currentPlayerId

  const [playerCursorError, playerCursor] = await safe(db
    .table('games')
    .filter({code})
    .concatMap(game => game('players'))
    .filter({sessionId, id: currentPlayerId})
    .run(connection))

  if (playerCursorError) {
    log.error(playerCursorError, socket)
    return
  }

  const [playersError, players] = await safe(playerCursor.toArray())

  if (playersError) {
    log.error(playersError, socket)
    return
  }

  if (players.length > 0) {
    const [updateError] = await safe(db
      .table('games')
      .filter({code})
      .update({
        roundEndTime: Date.now() + ROUND_TIME + ROUND_TIMEOFFSET,
        roundStartTime: Date.now() + ROUND_TIMEOFFSET,
        status: 'running'
      })
      .run(connection))

    if (updateError) {
      log.error(updateError, socket)
      return
    }

    // Reset game after elapsed game
    setTimeout(async () => {
      const [updateStatusError] = await safe(db
        .table('games')
        .filter({code})
        .update({
          roundEndTime: 0,
          roundStartTime: 0,
          status: 'idle'
        })
        .run(connection))

      if (updateStatusError) {
        log.error(updateStatusError, socket)
        return
      }

      const [playersCursorError, playersCursor] = await safe(db
        .table('games')
        .filter({code})
        .concatMap(game => game('players'))
        .run(connection))

      if (playersCursorError) {
        log.error(playersCursorError, socket)
        return
      }

      const [allPlayersError, allPlayers] = await safe(playersCursor.toArray())

      if (allPlayersError) {
        log.error(allPlayersError, socket)
        return
      }

      const currentPlayer = allPlayers.find(player => player.id === currentPlayerId)
      const currentPlayerIndex = allPlayers.indexOf(currentPlayer)

      let nextPlayer
      if (currentPlayerIndex === allPlayers.length - 1) {
        nextPlayer = allPlayers[0]
      } else {
        nextPlayer = allPlayers[currentPlayerIndex + 1]
      }

      const [gameCursorError, gameCursor] = await safe(db
        .table('games')
        .filter({code})
        .run(connection))

      if (gameCursorError) {
        log.error(gameCursorError, socket)
        return
      }

      const [gamesError, games] = await safe(gameCursor.toArray())

      if (gamesError) {
        log.error(gamesError, socket)
        return
      }

      const game = games.shift()

      if (game.currentTurn === game.maxTurns) {
        const [gameUpdateError] = await safe(db
          .table('games')
          .get(game.id)
          .update({
            status: 'finished',
            endScore: game.players
          })
          .run(connection))

        if (gameUpdateError) {
          log.error(gameUpdateError, socket)
          return
        }
      } else {
        const [replayGameError] = await safe(db
          .table('games')
          .filter({code})
          .update({
            currentPlayerId: nextPlayer.id,
            currentTurn: game.currentTurn + 1
          })
          .run(connection))

        if (replayGameError) {
          log.error(replayGameError, socket)
          return
        }
      }
    }, ROUND_TIME + ROUND_TIMEOFFSET)
  }
}

module.exports = startRound
