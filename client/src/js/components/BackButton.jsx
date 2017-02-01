import React from 'react'

function goBack (socket) {
  socket.emit('go-back')
}

const BackButton = ({ children }, { socket }) => (
	<button onClick={goBack.bind(null, socket)}>{children}</button>
) 

BackButton.contextTypes = {
  socket: React.PropTypes.object
}

export default BackButton