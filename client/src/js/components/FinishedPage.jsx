import React from 'react'
import BackButton from './BackButton.jsx'
const FinishedPage = ({ isGameOwner }) => (
  <h2>Game is finito</h2>
  {isGameOwner
        ? <BackButton>Avsluta Spel</BackButton>
        : <BackButton>Lämna Spel</BackButton>
      }
)

export default FinishedPage
