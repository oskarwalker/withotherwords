const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

// Server
const express = require('express')
const app = express()
const http = require('http').Server(app)
const socketio = require('socket.io')(http)
const { db, setupDatabase } = require('./db')
const setupSocket = require('./sockets')
const setupRoutes = require('./routes')
const sessionMiddleware = require('./session')

// Configure app
app.set('port', (process.env.PORT || 3000))
app.set('host', process.env.HOST)
app.set('baseUrl', __dirname)
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public/')))
app.use(helmet())
app.use(sessionMiddleware)

// Connect to database and run bootstrap
db.setup()
  .then(connection => bootstrap(connection))
  .catch(err => {
    console.log(err.message)
    process.exit(1)
  })

async function bootstrap (connection) {
  await setupDatabase(db, connection)
  setupSocket(socketio, db, connection)
  setupRoutes(app, db, connection, socketio)

  const port = app.get('port')
  const host = app.get('host')

  process.on('SIGINT', () =>
     connection.close(err =>
      process.exit(err ? 1 : 0)
    )
  )

  if (host) {
    http.listen(port, host, () => console.log(`listening on ${host}:${port}`))
  } else {
    http.listen(port, () => console.log(`listening on :${port}`))
  }
}
