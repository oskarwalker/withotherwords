import React from 'react'
import timer from 'react-timer-hoc'

const CountdownBase = ({ timer, synchronizeWith, offset, roundTime }) => {
  const now = Date.now() - offset

  if (now - synchronizeWith >= roundTime) {
    timer.stop()
  }

  const remaining = (now - synchronizeWith) / 1000
  return <div>{ (Math.max(0, roundTime / 1000 - remaining).toFixed(0)) }</div>
}

const Countdown = timer(1000)(CountdownBase)

export default Countdown
