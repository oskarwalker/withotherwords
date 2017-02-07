import React from 'react'
import BackButton from './BackButton.jsx'

function sortPlayersByPoints (players) {
  return players.sort((playerA, playerB) => playerB.points - playerA.points);
}

const FinishedPage = ({ players, isGameOwner }) => {

  // console.log(players)

  const sortedPlayers = sortPlayersByPoints(players.slice())

  const winner = [sortedPlayers.shift()]

  console.log(sortedPlayers)

  return (
    <div className="page-finished">
      {isGameOwner
        ? <BackButton>Avsluta Spel</BackButton>
        : <BackButton>Lämna Spel</BackButton>
      }
      <div className='winner'>
        <ul className='players'>
          {winner.map((player, index) => <li className="player-list-item" key={player.id}><h1>Vinnarna</h1><span className="player-points-wrapper"><span className="player-points">{player.points}</span><span className="player-points-label">Poäng</span></span><span className="player-name">{player.name}</span><span className="player-team">Lag {index + 1}</span></li>)}
        </ul>
      </div>
      <ul className='players'>
        {sortedPlayers.map((player, index) => <li className="player-list-item" key={player.id}><span className="player-team">Lag {index + 1}</span><span className="player-name">{player.name}</span><span className="player-points-wrapper"><span className="player-points">{player.points}</span><span className="player-points-label">Poäng</span></span></li>)}
      </ul>
    </div>
  )

}

export default FinishedPage