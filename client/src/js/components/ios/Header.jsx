import React from 'react'
import SVG from './SVG.jsx'

function Header ({ leftButton = null, title = null, rightButton = null }) {
  return (
    <header className='ios-header'>
      <div className='header-content'>
        <h1 className='title'>{title}</h1>
      </div>
      <SVG svgPath='svg/Header.svg' />
    </header>
  )
}

export default Header
