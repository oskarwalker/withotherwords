import React from 'react'
import BackButton from './BackButton.jsx'
import PlayerList from './PlayerList.jsx'

function startNextRound (socket, gameCode) {
  socket.emit('start-round', gameCode)
}

const BeforeRoundPage = ({ currentTurn, maxTurns, currentPlayerId, players, gameCode, isGameOwner, isPlayerTurn, clientPlayer }, { socket }) => (
  <div className='page before-round-page'>
    {isGameOwner
        ? <BackButton>Avsluta Spel</BackButton>
        : <BackButton>Lämna Spel</BackButton>
      }
    <div className='turns-left'>
      <p>Omgång {currentTurn} av {maxTurns}</p>
    </div>
    <PlayerList players={players} currentPlayerId={currentPlayerId} clientPlayer={clientPlayer} />
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
