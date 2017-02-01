import React from 'react'

function startNextRound (socket, gameCode) {
  socket.emit('start-round', gameCode)
}

const BeforeRoundPage = ({ currentPlayerId, players, gameCode, isGameOwner, isPlayerTurn }, { socket }) => (
    <div>
      <h1>Nästa runda</h1>
      <ul className='players'>
        {players.map(player => <li key={player.id}>{player.name} - {player.points} pts.</li>)}
      </ul>
      {isPlayerTurn
        ? <button onClick={startNextRound.bind(null, socket, gameCode)}>Starta nästa runda</button>
        : <p>{players.find(player => player.id === currentPlayerId).name} ska starta nästa spel.</p>
      }
    </div>
  )

BeforeRoundPage.contextTypes = {
  socket: React.PropTypes.object
}

export default BeforeRoundPage
