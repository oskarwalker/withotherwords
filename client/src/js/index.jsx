import React from 'react'
import { render } from 'react-dom'
import App from './components/App.jsx'

render(
  <App {...window.__INITIAL_PROPS__} />,
  document.getElementById('render-target')
)
