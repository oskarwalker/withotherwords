import React from 'react'

function BeforeRoundPage ({ currentPlayerId, currentPlayer, players, gameCode }) {

  return (
    <div>
      <h1>Nästa runda</h1>
      <ul className='players'>
        {players.map(player => <li key={player.id}>{player.name} - {player.points} pts.</li>)}
      </ul>
      {currentPlayerId === currentPlayer.id
        ? <button>Starta nästa runda</button>
        : <p>{players.find(player => player.id === currentPlayerId).name} ska starta nästa spel.</p>
      }
    </div>
  )
}

export default BeforeRoundPage
