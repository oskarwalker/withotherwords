import React from 'react'
import Countdown from './Countdown.jsx'
import GameTimer from './GameTimer.jsx'
import BackButton from './BackButton.jsx'

function skipWord (socket) {
  socket.emit('skip-word')
}

const PlayerGamePage = ({ synchronizeWith, offset, roundTime, currentPlayer, currentWord }, { socket }) => (
  <div className='player-game-page'>
    <BackButton>Avbryt</BackButton>
    <div className='game-meta'>
      <section>
        <span className='game-meta-label'>Tid kvar</span>
        <Countdown synchronizeWith={synchronizeWith} offset={offset} roundTime={roundTime} />
      </section>
      <section>
        <span className='game-meta-label'>Poäng</span>
        <span className='game-meta-points'>{currentPlayer.points}</span>
      </section>
    </div>
    <GameTimer
      synchronizeWith={synchronizeWith}
      offset={offset}
      roundTime={roundTime}
    >
      <span className='current-word' key={currentWord.id}>{currentWord.word}</span>
    </GameTimer>
    <button className='button-big button-bottom button-skip' onClick={skipWord.bind(null, socket)}>Hoppa över</button>
  </div>
)

PlayerGamePage.contextTypes = {
  socket: React.PropTypes.object
}

export default PlayerGamePage
