import React from 'react'

function startGame (socket) {
  socket.emit('start-game')
}

const LobbyPage = ({ players, gameCode, currentPlayerId, gameOwnerId }, { socket }) => (
  <div>
    <h1>Lobby page</h1>
    <h2>Game code</h2>
    <input type='text' value={gameCode} readOnly />
    <ul className='players'>
      {players.map(player => <li key={player.id}>{player.name}</li>)}
    </ul>
    {currentPlayerId === gameOwnerId
      ? <button onClick={startGame.bind(null, socket)}>Starta Spel</button>
      : <p>Väntar på att {players.find(player => player.id === gameOwnerId).name} ska starta spelet!</p>
    }
  </div>
)

LobbyPage.contextTypes = {
  socket: React.PropTypes.object
}

export default LobbyPage
