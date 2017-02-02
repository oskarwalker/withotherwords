const cookie = require('cookie')
const tss = require('timesync-socket')

// Routes
const createNewGame = require('./createNewGame.js')
const joinGame = require('./joinGame.js')
const startGame = require('./startGame.js')
const givePoint = require('./givePoint.js')
const startRound = require('./startRound.js')

const { gamePrivateFields } = require('../db/helper/game')
const { playerPrivateFields } = require('../db/helper/player')

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

    // Register routes
    const socketEventArgs = [socket, db, connection, sessionId]

    socket.on('create-new-game', createNewGame.bind(null, ...socketEventArgs))
    socket.on('join-game', joinGame.bind(null, ...socketEventArgs))
    socket.on('start-game', startGame.bind(null, ...socketEventArgs))
    socket.on('start-round', startRound.bind(null, ...socketEventArgs))
    socket.on('give-point', givePoint.bind(null, ...socketEventArgs))

    // register changefeeds
    const gamesChangesCursor = await db
          .table('games')
          .filter(game => game('players').contains(player => player('sessionId').eq(sessionId)))
          .without(gamePrivateFields)
          .changes()
          .run(connection)

    socket.on('disconnect', () => {
      gamesChangesCursor.close()
    })

    gamesChangesCursor.each((err, row) => {
      if (err) {
        if (connection.open !== false) {
          console.log(err)
          return
        }
        return
      }
      if (row.new_val && row.old_val) {
        socket.emit('game.update', row.new_val)
      } else if (row.new_val) {
        socket.emit('game.add', row.new_val)
      } else if (row.old_val) {
        socket.emit('game.remove', row.old_val.id)
      }
    })
  })
}

module.exports = setupSocket
