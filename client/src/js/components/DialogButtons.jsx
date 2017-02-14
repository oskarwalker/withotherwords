import React from 'react'

const DialogButtons = ({ onOk, okTitle, onCancel, cancelTitle }) => {
  return (
    <div className='dialog-buttons'>
      <button className='dialog-button dialog-button--left dialog-button-cancel' onClick={onCancel}>{cancelTitle}</button>
      <button className='dialog-button dialog-button--right dialog-button-ok' onClick={onOk}>{okTitle}</button>
    </div>
  )
}

export default DialogButtons
