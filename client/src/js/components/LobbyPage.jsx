import React from 'react'

function LobbyPage ({ players, gameCode }) {
  return (
    <div>
      <h1>Lobby page</h1>
      <h2>Game code</h2>
      <input type='text' value={gameCode} readOnly />
      <ul className='players'>
        {players.map(player => <li key={player.id}>{player.name}</li>)}
      </ul>
    </div>
  )
}

export default LobbyPage
