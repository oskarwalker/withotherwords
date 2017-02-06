import React from 'react'
import GameTimer from './GameTimer.jsx'

function skipWord (socket) {
  socket.emit('skip-word')
}

function getCurrentWord (words, wordIndex) {
  const length = words.length
  const index = wordIndex - (Math.floor(wordIndex / length) * length)
  console.log(index)
  return words[index].word
}

const PlayerGamePage = ({ synchronizeWith, offset, roundTime, words, wordIndex }, { socket }) => {

  const currentWord = getCurrentWord(words, wordIndex)

  return (
    <div className='player-game-page'>
      <GameTimer
        synchronizeWith={synchronizeWith}
        offset={offset}
        roundTime={roundTime}
      />
      <span className='current-word'>{currentWord}</span>
      <button onClick={skipWord.bind(null, socket)}>Hoppa över</button>
    </div>
  )
}

PlayerGamePage.contextTypes = {
  socket: React.PropTypes.object
}

export default PlayerGamePage
