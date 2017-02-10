const r = require('rethinkdb')
const getWordCursor = require('server/data/words')

r.setup = () => new Promise((resolve, reject) => {
  r.connect({ host: process.env.DB_HOST || 'localhost', port: 28015 })
    .then((connection) => {
      connection.on('error', err => console.log(err))
      r.connection = connection
      resolve(r)
    })
    .catch(reject)
})

const setupDatabase = (db) => new Promise(async (resolve, reject) => {
  // Setup Database
  const dbName = 'wow'
  const dbList = await db.dbList().run(db.connection)

  if (dbList.includes(dbName) === false) {
    try {
      await db.dbCreate(dbName).run(db.connection)
    } catch (ex) {
      reject(ex)
      return
    }
  }

  db.connection.use(dbName)

  // Setup tables
  const tableList = await db.tableList().run(db.connection)
  const tableNames = [
    'games',
    'words'
  ]

  let tableCreatePromises = []

  tableNames.forEach(tableName => {
    if (tableList.includes(tableName) === false) {
      tableCreatePromises.push(db.tableCreate(tableName).run(db.connection))
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
    const indexList = await db.table('words').indexList().run(db.connection)
    if (indexList.includes('category') === false) {
      await db.table('words').indexCreate('category').run(db.connection)
    }

    const tableEmpty = await db.table('words').count().run(db.connection) === 0
    const { cacheExists, getData } = await getWordCursor()

    if (cacheExists === false || tableEmpty === true) {
      if (cacheExists === false) {
        await db.table('words').delete().run(db.connection)
      }

      const words = await getData()
      await db.table('words').insert(words).run(db.connection)
    }
  } catch (ex) {
    reject(ex)
    return
  }

  resolve()
})

module.exports = {
  db: r,
  setupDatabase
}
