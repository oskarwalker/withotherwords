const wordsPrivateFields = []

const tableName = 'words'

const sampleWordsByCategories = (db, categories, sampleSize) =>
new Promise(async (resolve, reject) => {
  let wordCursor = db
    .table(tableName)

  if (categories.length !== 0) {
    wordCursor = wordCursor.getAll(...categories, {index: 'category'})
  }

  wordCursor
    .sample(sampleSize)
    .run(db.connection)
    .then(cursor => cursor.toArray())
    .then(resolve)
    .catch(reject)
})

module.exports = {
  sampleWordsByCategories,
  wordsPrivateFields
}
