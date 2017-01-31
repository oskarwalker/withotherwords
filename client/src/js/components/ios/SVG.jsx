import React from 'react'

function SVG ({ svgPath, ...props }) {
  return (
    <img src={svgPath} {...props} />
  )
}

export default SVG
