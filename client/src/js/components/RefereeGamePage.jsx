import React from 'react'
import Countdown from './Countdown.jsx'

function givePoint (socket) {
  socket.emit('give-point')
}

const RefereeGamePage = ({ synchronizeWith, offset, roundTime, currentWord }, { socket }) => (
  <div className='referee-game-page'>
    <span className='time-left-label'>Tid kvar</span>
    <Countdown synchronizeWith={synchronizeWith} offset={offset} roundTime={roundTime} />
    <span className='current-word' key={currentWord.id}>{currentWord.word}</span>
    <button className='button-big button-bottom button-point' onClick={givePoint.bind(null, socket)}>Ge poäng</button>
  </div>
)

RefereeGamePage.contextTypes = {
  socket: React.PropTypes.object
}

export default RefereeGamePage
