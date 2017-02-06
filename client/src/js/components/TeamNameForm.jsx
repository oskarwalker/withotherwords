import React from 'react'

const TeamNameForm = ({ onChange }) => (
  <form className="team-name-form">
    <input type='text' className="generic-text-input" placeholder='Lagnamn' onChange={onChange} />
  </form>
)

export default TeamNameForm
