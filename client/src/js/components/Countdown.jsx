import React from 'react'
import timer from 'react-timer-hoc'

const leftPad = (string, length, padChar = '0') => String(string).length >= length ? '' + string : (String(padChar).repeat(length) + string).slice(-length)

const CountdownBase = ({ timer, synchronizeWith, offset, roundTime }) => {
  const now = Date.now() - offset

  if (now - synchronizeWith >= roundTime) {
    timer.stop()
  }

  const remaining = (now - synchronizeWith) / 1000
  const secondsRemaining = Math.max(0, roundTime / 1000 - remaining)
  const minutes = Math.floor(Math.ceil(secondsRemaining) / 60)

  return <span className='countdown-digits'>{minutes}:{secondsRemaining > 59 ? '00' : leftPad(secondsRemaining.toFixed(0), 2)}</span>
}

const Countdown = timer(1000)(CountdownBase)

export default Countdown
