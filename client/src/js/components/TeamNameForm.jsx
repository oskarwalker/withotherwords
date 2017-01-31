import React from 'react'

const TeamNameForm = ({ onChange }) => (
  <form>
    <h1>Lagnamn</h1>
    <input type='text' onChange={onChange} />
  </form>
)

export default TeamNameForm
