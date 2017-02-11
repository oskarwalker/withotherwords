import React from 'react'
import BackButton from './BackButton.jsx'

function startGame (socket) {
  socket.emit('start-game')
}

const LobbyPage = ({ players, gameCode, gameOwnerId, isGameOwner }, { socket }) => (
  <div className='page lobby-page'>
    {isGameOwner
        ? <BackButton>Avsluta Spel</BackButton>
        : <BackButton>Lämna Spel</BackButton>
    }
    <input className='game-code' type='text' value={gameCode} readOnly />
    <span className='sub-note'>Bjud in andra med denna kod</span>
    <ul className='players'>
      {players.map((player, index) => <li className='player-list-item' key={player.id}><span className='player-team'>Lag {index + 1}</span><span className='player-name'>{player.name}</span></li>)}
    </ul>
    {isGameOwner
      ? <button className='button-big button-bottom' disabled={players.length < 2} onClick={startGame.bind(null, socket)}>Starta Spel</button>
      : <p className='info-text-bottom'>Väntar på att {players.find(player => player.id === gameOwnerId).name} ska starta spelet!</p>
    }
  </div>
)

LobbyPage.contextTypes = {
  socket: React.PropTypes.object
}

export default LobbyPage
