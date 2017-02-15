import React from 'react'

const TeamNameForm = ({ onChange }) => (
  <div className='team-name-form'>
    <p className='note top-note'>Börja med att skriva in lagnamn</p>
    <input type='text' className='generic-text-input' placeholder='Lagnamn' onChange={onChange} />
  </div>
)

export default TeamNameForm
