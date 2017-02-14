import React from 'react'
import DialogButtons from './DialogButtons.jsx'

const DialogContent = ({ children, onCancel, onOk }) => (
  <div>
    <div className='dialog-content'>
      {children}
    </div>
    <DialogButtons onCancel={onCancel} cancelTitle='Avbryt' onOk={onOk} okTitle='Anslut' />
  </div>
)

export default DialogContent
