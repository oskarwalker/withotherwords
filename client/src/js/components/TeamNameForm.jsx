import React from 'react'

const TeamNameForm = ({ onChange }) => (
  <div className='team-name-form'>
    <input type='text' className='generic-text-input' placeholder='Lagnamn' onChange={onChange} />
  </div>
)

export default TeamNameForm
