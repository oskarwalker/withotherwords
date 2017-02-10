require('babel-register')({
  extensions: ['.jsx']
})
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
app.use('/static', express.static(path.join(__dirname, '../public/')))
app.use(helmet())
app.use(helmet.referrerPolicy({ policy: 'origin' }))
app.use(sessionMiddleware)

// Connect to database and run bootstrap
db.setup()
  .then(bootstrap)
  .catch(err => {
    console.log(err)
    process.exit(1)
  })

async function bootstrap (db) {
  await setupDatabase(db)
  setupSocket(socketio, db)
  setupRoutes(app, db, socketio)

  const port = app.get('port')
  const host = app.get('host')

  process.on('SIGINT', () =>
     db.connection.close(err =>
      process.exit(err ? 1 : 0)
    )
  )

  if (host) {
    http.listen(port, host, () => console.log(`listening on ${host}:${port}`))
  } else {
    http.listen(port, () => console.log(`listening on :${port}`))
  }
}
