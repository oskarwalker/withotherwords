const cookie = require('cookie')
const tss = require('timesync-socket')

function setupSocket (socketio, db, connection) {
  // Setup sockets
  socketio.on('connection', async (socket) => {
    const sessionId = cookie.parse(socket.handshake.headers.cookie)['__sessid']

    if (!sessionId) {
      socket.disconnect()
      return
    }

    // Setup time sync
    tss.setup(socket)

    const socketEventArgs = [socket, db, connection, sessionId]

    socket.on('create-new-game', onCreateNewGame.bind(null, ...socketEventArgs))
    socket.on('join-game', onJoinGame.bind(null, socket, db, connection, sessionId))
    socket.on('start-game', onStartGame.bind(null, socketio, ...socketEventArgs))

    const gamePublicFields = ['id', 'code', 'status', 'players']

    const gamesChangesCursor = await db
          .table('games')
          .filter(game => game('players').contains(player => player('sessionId').eq(sessionId)))
          .withFields(gamePublicFields)
          .changes()
          .run(connection)
    
    // register changefeed
    gamesChangesCursor.each((err, row) => {
      if (err) {
        console.log(err)
        return
      }
      if (row.new_val && row.old_val) {
        socket.emit('game.update', row.new_val)
      } else if (row.new_val) {
        socket.emit('game.add', row.new_val)
      } else if (row.old_val) {
        socket.emit('game.remove', row.old_val.id)
      }

      socket.on('disconnect', () => {
        gamesChangesCursor.close()
      })
    })

    // Send current game
    const gamesCursor = await db
          .table('games')
          .filter(game => game('players').contains(player => player('sessionId').eq(sessionId)))
          .withFields(gamePublicFields)
          .run(connection)

    const games = await gamesCursor.toArray()

    if (games.length > 0) {
      socket.emit('game', games[0])
    }
  })
}

async function onCreateNewGame (socket, db, connection, sessionId, name, categories = []) {
  const randomCode = (low, high) => Math.floor(Math.random() * (high - low + 1) + low)

  if (categories.length !== 0) {
    const wordCursor = await db
      .table('words')
      .getAll(...categories, {index: 'category'})
      .run(connection)

    const words = await wordCursor.toArray()
    socket.emit('words', words)
  }

  db.table('games').insert({
    sessionId,
    players: [{
      name,
      sessionId,
      points: 0
    }],
    code: randomCode(10000, 90000),
    status: 'waitingforplayers'
  }).run(connection)
    .then(() => { console.log(`new game created by: ${sessionId}`) })
    .catch(err => { throw err })
}

function onJoinGame (socket, db, connection, sessionId, code, name) {
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
        return db.table('games').filter({code}).update({players: db.row('players').append({
          sessionId,
          name,
          points: 0
        })}).run(connection)
      } else {
        socket.emit('gameError', 'You\'re already in that game!')
      }
    })
    .catch(err => socket.emit('gameError', 'You can not join this game right now!')) //eslint-disable-line
}

async function onStartGame (socketio, socket, db, connection, sessionId, id) {
  const game = await db
    .table('games')
    .get(id)
    .run(connection)
    .catch(ex => socket.emit('gameError', 'Could not start game right now.'))

  if (game.sessionId !== sessionId) {
    return
  }

  db.table('games')
    .get(id)
    .update({status: 'idle'})
    .run(connection)
    .catch(ex => socket.emit('gameError', 'Could not start game right now.'))
}

module.exports = setupSocket
