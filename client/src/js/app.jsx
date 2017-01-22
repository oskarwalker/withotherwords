import React from 'react'
import { render } from 'react-dom'
import tss from 'timesync-socket/client'
import App from './components/App.jsx'

// Open socket for communication
const socket = io.connect(window.cordova ? 'https://wow.oskarwalker.se' : undefined) // eslint-disable-line no-use-before-define

// Setup time sync
tss.setup(socket)

render(
  <App tss={tss} socket={socket} />,
  document.getElementById('render-target')
)
