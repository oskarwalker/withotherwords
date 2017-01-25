import React from 'react'
import timer from 'react-timer-hoc'

const CountdownBase = ({ timer, synchronizeWith, startTime = 60 }) => {
  const now = Date.now()

  if (now - synchronizeWith >= startTime * 1000) {
    timer.stop()
  }

  const remaining = (now - synchronizeWith) / 1000
  return <div>{ (Math.max(0, startTime - remaining).toFixed(0)) }</div>
}

const Countdown = timer(1000)(CountdownBase)

export default Countdown
