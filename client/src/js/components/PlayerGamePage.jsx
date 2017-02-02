import React from 'react'
import GameTimer from './GameTimer.jsx'

const PlayerGamePage = ({ synchronizeWith, offset, roundTime }) => (
  <GameTimer
    synchronizeWith={synchronizeWith}
    offset={offset}
    roundTime={roundTime}
  />
)

export default PlayerGamePage
