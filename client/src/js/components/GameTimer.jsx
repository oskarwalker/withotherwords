import React, { Component } from 'react'
import Countdown from './Countdown.jsx'

const GameTimer = ({ synchronizeWith, roundTime }) => (

  <div className="game-timer">
    <svg version="1.1"
       xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
       x="0px" y="0px" width="129px" height="129px" viewBox="0 0 129 129" xmlSpace="preserve">
      <circle className="timer-bg" cx="64.5" cy="64.5" r="54.5"/>
      <circle className="timer" style={{animationDuration: `${roundTime / 1000}s`, animationDelay: `-${(Date.now() - synchronizeWith) / 1000}s` }} cx="64.5" cy="64.5" r="54.5"/>
    </svg>
    <Countdown synchronizeWith={synchronizeWith} roundTime={roundTime} />

  </div>

)

export default GameTimer
