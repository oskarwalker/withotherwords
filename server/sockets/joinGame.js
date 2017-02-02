async function joinGame (socket, db, connection, sessionId, code, name) {
  try {
    const newPlayerId = await db.uuid().run(connection)

    const playerObject = {
      id: newPlayerId,
      sessionId,
      name,
      points: 0
    }

    db.table('games')
      .filter(game =>
          game('code').eq(code)
          .and(
            game('players').contains(player => player('sessionId').ne(sessionId))
          )
      )
      .run(connection)
      .catch(err => { throw err })
      .then(cursor => cursor.toArray())
      .then(games => {
        if (games.length > 0) {
          return db
            .table('games')
            .filter({code})
            .update({
              players: db.row('players').append(playerObject)
            })
            .run(connection)
        } else {
          socket.emit('gameError', 'You\'re already in that game!')
        }
      })
      .then(result => {
        socket.emit('player.add', playerObject)
      })
      .catch(err => {
        socket.emit('gameError', 'Could not join that game right now.')
        console.log(err)
      })
  } catch (ex) {
    console.log(ex)
    socket.emit('gameError', 'Something went wrong.')
  }
}

module.exports = joinGame
