import React from 'react'

const GameCodeForm = ({ onChange, onSubmit, value }) => (
  <form onSubmit={onSubmit}>
    <input type='text' pattern='\d*' placeholder='12345' value={value} onChange={onChange} />
  </form>
)

export default GameCodeForm
