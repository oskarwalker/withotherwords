import React from 'react'
import { render } from 'react-dom'
import App from './components/App.jsx'

const window = window || global

function renderApp (props = {}) {
  render(
    <App {...props} />,
    document.getElementById('render-target')
  )
}

if(window.cordova) {
  fetch('https://wow.oskarwalker.se/game', {
    credentials: 'include'
  })
  .then(response => response.json())
  .then(game => {
    window.navigator.splashscreen.hide()
    renderApp({game})
  })
  .catch(err => {
    window.navigator.splashscreen.hide()
    renderApp()
  })
} else {
  renderApp(window.__INITIAL_PROPS__)
}
