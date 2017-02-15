import React from 'react'

const PlayerList = ({ players, currentPlayerId, clientPlayer }) => {
  const renderedPlayers = players.map((player, index) => (
    <li className='player-list-item' key={player.id}>
      {player.id === currentPlayerId &&
      <span className='player-next-up'>{clientPlayer.id === player.id ? 'Er tur' : 'Deras tur'}</span>
      }
      <span className='player-team'>Lag {index + 1}</span>
      <span className='player-name'>{player.name}</span>
      <span className='player-points-wrapper'>
        <span className='player-points'>{player.points}</span>
        <span className='player-points-label'>Poäng</span>
      </span>
    </li>
  ))

  return (
    <ul className='players'>
      {renderedPlayers}
    </ul>
  )
}

export default PlayerList
