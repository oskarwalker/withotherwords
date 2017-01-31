async function createNewGame (socket, db, connection, sessionId, name, categories = []) {
  try {
    const randomCode = (low, high) => Math.floor(Math.random() * (high - low + 1) + low)

    if (categories.length !== 0) {
      const wordCursor = await db
        .table('words')
        .getAll(...categories, {index: 'category'})
        .run(connection)

      const words = await wordCursor.toArray()
      socket.emit('words', words)
    }

    const newPlayerId = await db.uuid().run(connection)

    const playerObject = {
        id: newPlayerId,
        sessionId,
        name,
        points: 0,
    }

    const gameObject = {
      sessionId,
      players: [playerObject],
      code: randomCode(10000, 90000),
      status: 'waitingforplayers',
      roundEndTime: 0,
      roundStartTime: 0,    
    }

    db.table('games')
      .insert(gameObject)
      .run(connection)
      .then(() => { 
        socket.emit('player.add', playerObject)
      })
      .catch(err => { throw err })
  } catch (ex) {
    socket.emit('gameError', 'Something went wrong.')
  }
}

module.exports = createNewGame
