import React from 'react'
import Countdown from './Countdown.jsx'

const RefereeGamePage = ({ synchronizeWith, offset, roundTime, currentWord }) => (
  <div className='referee-game-page'>
    <Countdown synchronizeWith={synchronizeWith} offset={offset} roundTime={roundTime} />
    <span className='current-word'>{currentWord}</span>
  </div>
)

export default RefereeGamePage
