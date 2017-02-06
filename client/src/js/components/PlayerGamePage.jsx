import React from 'react'
import GameTimer from './GameTimer.jsx'

function skipWord (socket) {
  socket.emit('skip-word')
}

const PlayerGamePage = ({ synchronizeWith, offset, roundTime, currentWord }, { socket }) => (
  <div className='player-game-page'>
    <GameTimer
      synchronizeWith={synchronizeWith}
      offset={offset}
      roundTime={roundTime}
    />
    <span className='current-word'>{currentWord}</span>
    <button className='button-big button-bottom button-skip' onClick={skipWord.bind(null, socket)}>Hoppa över</button>
  </div>
)

PlayerGamePage.contextTypes = {
  socket: React.PropTypes.object
}

export default PlayerGamePage
