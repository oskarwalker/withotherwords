const { ROUND_TIME, ROUND_TIMEOFFSET } = require('../config')

async function startRound (socket, db, connection, sessionId, code) {
  try {
    if (code === undefined) {
      socket.emit('gameError', 'You need specify the game\'s code to start round')
      return
    }

    const currentPlayerIdCursor = await db
      .table('games')
      .filter({code})
      .withFields(['currentPlayerId'])
      .run(connection)

    const currentPlayerId = (await currentPlayerIdCursor.toArray())[0].currentPlayerId

    const playerCursor = await db
      .table('games')
      .filter({code})
      .concatMap(game => game('players'))
      .filter({sessionId, id: currentPlayerId})
      .run(connection)

    const players = await playerCursor.toArray()

    if (players.length > 0) {
      await db
        .table('games')
        .filter({code})
        .update({
          roundEndTime: Date.now() + ROUND_TIME + ROUND_TIMEOFFSET,
          roundStartTime: Date.now() + ROUND_TIMEOFFSET,
          status: 'running'
        })
        .run(connection)

      // Reset game after elapsed game
      setTimeout(async () => {
        try {
          await db
            .table('games')
            .filter({code})
            .update({
              roundEndTime: 0,
              roundStartTime: 0,
              status: 'idle'
            })
            .run(connection)

          const playersCursor = await db
            .table('games')
            .concatMap(game => game('players'))
            .run(connection)

          const allPlayers = await playersCursor.toArray()

          const currentPlayer = allPlayers.find(player => player.id === currentPlayerId)
          const currentPlayerIndex = allPlayers.indexOf(currentPlayer)

          let nextPlayer
          if (currentPlayerIndex === allPlayers.length - 1) {
            nextPlayer = allPlayers[0]
          } else {
            nextPlayer = allPlayers[currentPlayerIndex + 1]
          }

          db
            .table('games')
            .filter({code})
            .update({
              currentPlayerId: nextPlayer.id
            })
            .run(connection)
        } catch (ex) { console.log(ex) }
      }, ROUND_TIME + ROUND_TIMEOFFSET)
    }
  } catch (ex) {
    console.log(ex)
  }
}

module.exports = startRound
