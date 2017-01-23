const fs = require('fs')
const path = require('path')

const wordsFolder = path.join(__dirname, '../../words/')
const wordsCacheFile = path.join(wordsFolder, 'words.json')

async function cacheExists () {
  try {
    await new Promise((resolve, reject) =>
      fs.stat(wordsCacheFile, (err, stat) =>
        err ? reject(err) : resolve()
      )
    )
    return true
  } catch (ex) { return false }
}

function getCachedWords () {
  return new Promise((resolve, reject) =>
    fs.readFile(wordsCacheFile, 'utf8', (err, data) =>
      err ? reject(err) : resolve(JSON.parse(data))
    )
  )
}

function generateCache () {
  return new Promise((resolve, reject) =>
    fs.readdir(wordsFolder, (err, files) => {
      if (err) {
        reject(err)
        return
      }

      const promises = files.map(file =>
        new Promise((resolve, reject) =>
          fs.readFile(path.join(wordsFolder, file), 'utf8', (err, data) =>
            err ? reject(err) : resolve(data)
          )
        )
      )

      Promise.all(promises)
      .then(fileContents =>
        fileContents
        .map(fileContent => {
          const [category, ...words] = fileContent.split('\n')
          return words.map(word => ({ category, word }))
        })
        .reduce((prev, next) => prev.concat(next), [])
      )
      .then(resolve)
      .catch(reject)
    })
  )
}

function writeCache (words) {
  return new Promise((resolve, reject) =>
    fs.writeFile(wordsCacheFile, JSON.stringify(words), (err) =>
      err ? reject(err) : resolve()
    )
  )
}

module.exports = () => new Promise(async (resolve, reject) => {
  const cached = await cacheExists()

  if (cached === false) {
    try {
      const words = await generateCache()
      await writeCache(words)

      resolve({
        cacheExists: cached,
        getData: () => new Promise((resolve, reject) => resolve(words))
      })
    } catch (ex) {
      reject(ex)
    }
  } else {
    resolve({
      cacheExists: cached,
      getData: () => getCachedWords()
    })
  }
})
