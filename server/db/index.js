const rethinkdb = require('rethinkdb')
const getWordCursor = require('../data/words')

rethinkdb.setup = () => new Promise((resolve, reject) => {
  rethinkdb.connect({ host: process.env.DB_HOST || 'localhost', port: 28015 })
    .then((connection) => {
      resolve(connection)
    })
    .catch(reject)
})

const setupDatabase = (db, connection) => new Promise(async (resolve, reject) => {
  // Setup Database
  const dbName = 'wow'
  const dbList = await db.dbList().run(connection)

  if (dbList.includes(dbName) === false) {
    try {
      await db.dbCreate(dbName).run(connection)
    } catch (ex) {
      reject(ex)
      return
    }
  }

  connection.use(dbName)

  // Setup tables
  const tableList = await db.tableList().run(connection)
  const tableNames = [
    'games',
    'words'
  ]

  let tableCreatePromises = []

  tableNames.forEach(tableName => {
    if (tableList.includes(tableName) === false) {
      tableCreatePromises.push(db.tableCreate(tableName).run(connection))
    }
  })

  try {
    await Promise.all(tableCreatePromises)
  } catch (ex) {
    if (ex.msg.indexOf('exists') === -1) {
      reject(ex)
      return
    }
  }

  // Setup words
  try {
    // Create secondary index for category
    await db.table('words').indexCreate('category').run(connection)

    const tableEmpty = await db.table('words').count().run(connection) === 0
    const { cacheExists, getData } = await getWordCursor()

    if (cacheExists === false || tableEmpty === true) {
      if (cacheExists === false) {
        await db.table('words').delete().run(connection)
      }

      const words = await getData()
      await db.table('words').insert(words).run(connection)
    }
  } catch (ex) {
    reject(ex)
    return
  }

  resolve()
})

module.exports = {
  db: rethinkdb,
  setupDatabase
}
