import React from 'react'
import GameTimer from './GameTimer.jsx'

function skipWord (socket) {
  socket.emit('skip-word')
}

const PlayerGamePage = ({ synchronizeWith, offset, roundTime }, { socket }) => (
  <div className="player-game-page">
    <GameTimer
      synchronizeWith={synchronizeWith}
      offset={offset}
      roundTime={roundTime}
    />
    <button onClick={skipWord.bind(null, socket)}>Hoppa över</button>
  </div>
)

PlayerGamePage.contextTypes = {
  socket: React.PropTypes.object
}

export default PlayerGamePage
