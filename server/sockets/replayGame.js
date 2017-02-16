const safe = require('server/lib/safe')
const log = require('server/lib/log')
const { WORD_SAMPLE_SIZE } = require('server/config')
const { sampleWordsByCategories } = require('server/db/words')
const { getGameBySession } = require('server/db/game')

async function replayGame (socket, db, sessionId) {
  const [gameError, game] = await safe(getGameBySession(db, sessionId, { privateFields: true }))

  if (gameError) {
    log.error(gameError, socket)
    return
  }

  if (game === null) {
    socket.emit('gameError', 'You\'re not in a game.')
    return
  }

  if (game.sessionId !== sessionId) {
    socket.emit('gameError', 'Only the owner can replay the game.')
    return
  }

  if (game.status !== 'finished') {
    socket.emit('gameError', 'You can\'t replay the game before it\'s finished.')
    return
  }

  const [wordsError, words] = await safe(sampleWordsByCategories(db, game.categories, WORD_SAMPLE_SIZE))
  if (wordsError) return log.error(wordsError, socket)

  const [updateError] = await safe(db
    .table('games')
    .get(game.id)
    .update({
      status: 'waitingforplayers',
      players: game.players.map(player => Object.assign({}, player, {points: 0})),
      maxTurns: -1,
      currentTurn: -1,
      currentPlayerId: -1,
      wordIndex: 1,
      words,
    })
    .run(db.connection))

  if (updateError) {
    log.error(updateError, socket)
  }
}

module.exports = replayGame
