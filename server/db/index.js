const rethinkdb = require('rethinkdb')

rethinkdb.setup = () => new Promise((resolve, reject) => {
  rethinkdb.connect({ host: process.env.DB_HOST || 'localhost', port: 28015 })
    .then((connection) => {
      resolve(connection)
    })
    .catch(reject)
})

const setupDatabase = (db, connection) => new Promise(async (resolve, reject) => {
  try {
    await db.dbCreate('wow').run(connection)
  } catch (ex) {}

  connection.use('wow')

  try {
    await db.tableCreate('games').run(connection)
  } catch (ex) {}

  resolve()
})

module.exports = {
  db: rethinkdb,
  setupDatabase
}
