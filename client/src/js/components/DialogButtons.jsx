import React from 'react'

const DialogButtons = ({onOk, onCancel }) => {
	return(
		<div className="dialog-buttons">
      <button className="dialog-button dialog-button--left dialog-button-cancel" onClick={onCancel}>Avbryt</button> 
      <button className="dialog-button dialog-button--right dialog-button-ok" onClick={onOk}>Anslut</button>
    </div>
	)
}

export default DialogButtons