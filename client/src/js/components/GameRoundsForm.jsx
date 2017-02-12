import React from 'react'

const GameRoundsForm = ({ rounds, onChange, disabled }) => (
  <div className='game-rounds-form'>
    <select value={rounds} className='generic-select-input' onChange={onChange} disabled={disabled}>
      <option value='2'>2</option>
      <option value='3'>3</option>
      <option value='4'>4</option>
      <option value='5'>5</option>
      <option value='6'>6</option>
      <option value='7'>7</option>
      <option value='8'>8</option>
    </select>

  </div>
)

export default GameRoundsForm
