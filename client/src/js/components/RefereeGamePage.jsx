import React from 'react'
import Countdown from './Countdown.jsx'

function givePoint (socket) {
  socket.emit('give-point')
}

const RefereeGamePage = ({ synchronizeWith, offset, roundTime, currentWord }, { socket }) => (
  <div className='referee-game-page'>
    <span className='time-left-label'>Tid kvar</span>
    <Countdown synchronizeWith={synchronizeWith} offset={offset} roundTime={roundTime} />
    <div className='referee-game-page-content'>
      <span className='current-word-referee' key={currentWord.id}>{currentWord.word}</span>
      <span className='button-point-note'>Har de gissat rätt?</span>
      <button className='button-big button-point' onClick={givePoint.bind(null, socket)}>Ge poäng</button>
    </div>
  </div>
)

RefereeGamePage.contextTypes = {
  socket: React.PropTypes.object
}

export default RefereeGamePage
