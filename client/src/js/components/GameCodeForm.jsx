import React from 'react'

const GameCodeForm = ({ onChange, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <input type='number' pattern='\d*' onChange={onChange} />
  </form>
)

export default GameCodeForm
