import React from 'react'

const DialogButtons = ({onOk, onCancel }) => {
	return(
		<div className="dialog-buttons">
      <button className="dialog-button-ok" onClick={onOk}>Anslut</button>
      <button className="dialog-button-cancel" onClick={onCancel}>Avbryt</button> 
    </div>
	)
}

export default DialogButtons