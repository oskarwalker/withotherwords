const sanitizer = require('sanitizer')
const safe = require('server/lib/safe')
const log = require('server/lib/log')
const { WORD_SAMPLE_SIZE } = require('server/config')
const { sampleWordsByCategories } = require('server/db/words')

function randomCode (low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}

async function createNewGame (socket, db, sessionId, name, categories = []) {
  // Sanitize input
  name = sanitizer.sanitize(name)

  if (!name) {
    socket.emit('gameError', 'Please provide a team name to join a game.')
    return
  }

  const [wordsError, words] = await safe(sampleWordsByCategories(db, categories, WORD_SAMPLE_SIZE))
  if (wordsError) return log.error(wordsError, socket)

  const [newPlayerIdError, newPlayerId] = await safe(db.uuid().run(db.connection))
  if (newPlayerIdError) return log.error(newPlayerIdError, socket)

  let newCode
  let codeQueryCount

  do {
    newCode = randomCode(10000, 90000)

    let codeQueryCountError
    [codeQueryCountError, codeQueryCount] = await safe(db.table('games').filter({code: newCode}).count().run(db.connection))
    if (codeQueryCountError) return log.error(codeQueryCountError, socket)
  } while (codeQueryCount > 0)

  const playerObject = {
    id: newPlayerId,
    sessionId,
    name,
    points: 0
  }

  const gameObject = {
    sessionId,
    ownerId: newPlayerId,
    players: [playerObject],
    code: newCode,
    rounds: 2,
    status: 'waitingforplayers',
    categories,
    roundEndTime: 0,
    roundStartTime: 0,
    words,
    wordIndex: 0
  }

  const [insertError] = await safe(
    db.table('games')
    .insert(gameObject)
    .run(db.connection))

  if (insertError) return log.error(insertError, socket, 'Could not create game right now')

  delete playerObject['sessionId']
  socket.emit('player.add', playerObject)
}

module.exports = createNewGame
