import React from 'react'

const HelpDialogContainer = ({ children, onClick }) => (
  <div className='help-dialog-wrapper'>
    <div className='help-dialog-overlay' onClick={onClick} />
    <div className='help-dialog-container'>
      {children}
    </div>
  </div>
)

export default HelpDialogContainer
