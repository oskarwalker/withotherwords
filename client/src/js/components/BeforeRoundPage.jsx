import React from 'react'
import BackButton from './BackButton.jsx'
function startNextRound (socket, gameCode) {
  socket.emit('start-round', gameCode)
}

const BeforeRoundPage = ({ currentTurn, maxTurns, currentPlayerId, players, gameCode, isGameOwner, isPlayerTurn }, { socket }) => (
  <div className='page before-round-page'>
    {isGameOwner
        ? <BackButton>Avsluta Spel</BackButton>
        : <BackButton>Lämna Spel</BackButton>
      }
    <div className='turns-left'>
      <p>Omgång {currentTurn} av {maxTurns}</p>
    </div>
    <ul className='players'>
      {players.map((player, index) => <li className='player-list-item' key={player.id}><span className='player-team'>Lag {index + 1}</span><span className='player-name'>{player.name}</span><span className='player-points-wrapper'><span className='player-points'>{player.points}</span><span className='player-points-label'>Poäng</span></span></li>)}
    </ul>
    {isPlayerTurn
        ? <button className='button-big button-bottom' onClick={startNextRound.bind(null, socket, gameCode)}>Starta nästa omgång</button>
        : <p className='info-text-bottom'>{players.find(player => player.id === currentPlayerId).name} ska starta nästa omgång.</p>
      }
  </div>
  )

BeforeRoundPage.contextTypes = {
  socket: React.PropTypes.object
}

export default BeforeRoundPage
