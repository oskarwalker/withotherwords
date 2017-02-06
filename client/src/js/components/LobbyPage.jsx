import React from 'react'
import BackButton from './BackButton.jsx'

function startGame (socket) {
  socket.emit('start-game')
}

const LobbyPage = ({ players, gameCode, gameOwnerId, isGameOwner }, { socket }) => (
  <div>
    {isGameOwner
        ? <BackButton>Avsluta Spel</BackButton>
        : <BackButton>Lämna Spel</BackButton>
    }
    <h1>Lobby page</h1>
    <h2>Game code</h2>
    <input type='text' value={gameCode} readOnly />
    <ul className='players'>
      {players.map(player => <li key={player.id}>{player.name}</li>)}
    </ul>
    {isGameOwner
      ? <button className="button-big button-bottom" disabled={players.length < 2} onClick={startGame.bind(null, socket)}>Starta Spel</button>
      : <p>Väntar på att {players.find(player => player.id === gameOwnerId).name} ska starta spelet!</p>
    }
  </div>
)

LobbyPage.contextTypes = {
  socket: React.PropTypes.object
}

export default LobbyPage
