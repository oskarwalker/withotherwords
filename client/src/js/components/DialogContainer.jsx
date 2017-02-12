import React from 'react'

const DialogContainer = ({ children, onClick, error }) => (
  <div className='dialog-wrapper'>
    <div className='dialog-overlay' onClick={onClick} />
    <div className={`dialog-container${error ? ' dialog-container-error' : ''}`}>
      {children}
    </div>
  </div>
)

export default DialogContainer
