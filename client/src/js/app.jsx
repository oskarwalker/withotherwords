import React from 'react'
import { render } from 'react-dom'
import ntp from 'socket-ntp/client/ntp.js'

const socket = io.connect(window.cordova ? 'https://wow.oskarwalker.se' : undefined) // eslint-disable-line no-use-before-define
ntp.init(socket, { interval: 5000 })

render(
  <p>Ciao mano</p>,
  document.getElementById('render-target')
)
