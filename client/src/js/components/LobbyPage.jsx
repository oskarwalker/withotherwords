import React from 'react'

function LobbyPage ({ players }) {
  return (
    <div>
      <h1>Lobby page</h1>
      <ul className='players'>
        {players.map(player => <li key={player.sessionId}>{player.name}</li>)}
      </ul>
    </div>
  )
}

export default LobbyPage
