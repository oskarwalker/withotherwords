import React from 'react'
import DialogButtons from './DialogButtons.jsx'

const Confirm = ({ onConfirm, children }) => (
  <div className='dialog-wrapper'>
    <div className='dialog-overlay' />
    <div className='confirm-dialog-container'>
      <div className='confirm-dialog-content'>
        <p>{children}</p>
      </div>
      <DialogButtons onCancel={onConfirm.bind(null, false)} cancelTitle='Avbryt' onOk={onConfirm.bind(null, true)} okTitle='Ok' />
    </div>
  </div>
)

export default Confirm
