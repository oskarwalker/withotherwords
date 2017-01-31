import React from 'react'

const GameCodeForm = ({ onChange }) => (
  <form>
    <h3>Spelkod</h3>
    <input type='text' onChange={onChange} />
  </form>
)

export default GameCodeForm
