import React from 'react'
import { render } from 'react-dom'
import App from './components/App.jsx'

import 'whatwg-fetch'

const window = window || global

function renderApp (props = {}) {
  render(
    <App {...props} />,
    document.getElementById('render-target')
  )
}

if (window.cordova) {
  window.document.body.classList.add(window.cordova.platformId)

  fetch('https://wow.oskarwalker.se/initial-props', { // eslint-disable-line no-undef
    credentials: 'include'
  })
  .then(response => response.json())
  .then(props => {
    window.navigator.splashscreen.hide()
    renderApp(props)
  })
  .catch(err => {
    if (err) {
      console.log(err)
    }
    window.navigator.splashscreen.hide()
    renderApp()
  })
} else {
  renderApp(window.__INITIAL_PROPS__)
}
