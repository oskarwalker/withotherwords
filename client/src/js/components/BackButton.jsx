import React from 'react'

function goBack (socket) {
  socket.emit('go-back')
}

const BackButton = ({ children }, { socket }) => (
  <div className="back-button">
    <svg version="1.1"
     xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
     x="0px" y="0px" width="84.1px" height="154px" viewBox="0 0 84.1 154"
     xmlSpace="preserve">
      <polyline className="back-button-tick" points="80.5,150.4 7.1,77 80.5,3.5 "/>
    </svg>

    <button onClick={goBack.bind(null, socket)}>{children}</button>
  </div>
)

BackButton.contextTypes = {
  socket: React.PropTypes.object
}

export default BackButton
