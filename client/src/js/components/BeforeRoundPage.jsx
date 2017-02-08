import React from 'react'
import BackButton from './BackButton.jsx'
function startNextRound (socket, gameCode) {
  socket.emit('start-round', gameCode)
}

const BeforeRoundPage = ({ currentPlayerId, players, gameCode, isGameOwner, isPlayerTurn }, { socket }) => (
  <div>
    {isGameOwner
        ? <BackButton>Avsluta Spel</BackButton>
        : <BackButton>Lämna Spel</BackButton>
      }
    <ul className='players'>
      {players.map((player, index) => <li className='player-list-item' key={player.id}><span className='player-team'>Lag {index + 1}</span><span className='player-name'>{player.name}</span><span className='player-points-wrapper'><span className='player-points'>{player.points}</span><span className='player-points-label'>Poäng</span></span></li>)}
    </ul>
    {isPlayerTurn
        ? <button className='button-big button-bottom' onClick={startNextRound.bind(null, socket, gameCode)}>Starta nästa runda</button>
        : <p className='info-text-bottom'>{players.find(player => player.id === currentPlayerId).name} ska starta nästa spel.</p>
      }
  </div>
  )

BeforeRoundPage.contextTypes = {
  socket: React.PropTypes.object
}

export default BeforeRoundPage
