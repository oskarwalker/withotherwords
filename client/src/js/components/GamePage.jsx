import React from 'react'
import Countdown from './Countdown.jsx'

function GamePage ({ tss }) {
  return (
    <div>
      <h1>Game page</h1>
      <Countdown synchronizeWith={Date.now() - tss.offset()} startTime={60} />
    </div>
  )
}

export default GamePage
