import React from 'react'

const DialogContainer = ({ children, onClick }) => (
  <div className='dialog-overlay' onClick={onClick}>
    <div className='dialog-container'>
      {children}
    </div>
  </div>
)

export default DialogContainer
