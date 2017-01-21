const path = require('path')

function setupRoutes (app, db, connection, socketio) {
  app.get('/', (req, res) => res.sendFile(path.join(app.get('baseUrl'), 'public/index.html')))
}

module.exports = setupRoutes
