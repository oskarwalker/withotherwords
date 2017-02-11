import React from 'react'

const GameCodeForm = ({ onChange }) => (
  <form>
    <input type='number' pattern='\d*' onChange={onChange} />
  </form>
)

export default GameCodeForm
