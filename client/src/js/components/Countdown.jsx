import React from 'react'
import timer from 'react-timer-hoc'

const CountdownBase = ({ timer, synchronizeWith, offset, roundTime }) => {
  const now = Date.now() - offset

  if (now - synchronizeWith >= roundTime) {
    timer.stop()
  }

  const remaining = (now - synchronizeWith) / 1000
  const secondsRemaining = Math.max(0, roundTime / 1000 - remaining)

  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = Math.floor(secondsRemaining - minutes * 60)

  return <span className='countdown-digits'>{minutes}:{seconds}</span>
}

const Countdown = timer(1000)(CountdownBase)

export default Countdown
