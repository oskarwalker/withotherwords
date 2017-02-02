async function createNewGame (socket, db, connection, sessionId, name, categories = []) {
  try {
    const randomCode = (low, high) => Math.floor(Math.random() * (high - low + 1) + low)

    let wordCursor = db
      .table('words')

    if (categories.length !== 0) {
      wordCursor = wordCursor.getAll(...categories, {index: 'category'})
    }

    wordCursor = await wordCursor
      .sample(100)
      .run(connection)

    const words = await wordCursor.toArray()

    const newPlayerId = await db.uuid().run(connection)

    const playerObject = {
      id: newPlayerId,
      sessionId,
      name,
      points: 0
    }

    const gameObject = {
      sessionId,
      ownerId: newPlayerId,
      players: [playerObject],
      code: randomCode(10000, 90000),
      status: 'waitingforplayers',
      roundEndTime: 0,
      roundStartTime: 0,
      words,
      wordIndex: 0
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
    console.log(ex)
  }
}

module.exports = createNewGame
