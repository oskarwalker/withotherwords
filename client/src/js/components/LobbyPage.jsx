import React, { Component } from 'react'
import BackButton from './BackButton.jsx'
import GameRoundsForm from './GameRoundsForm.jsx'

function startGame (socket) {
  socket.emit('start-game')
}

class LobbyPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      rounds: props.rounds
    }
  }

  setRounds (e) {
    if (!isNaN(e.target.value) && e.target.value > 0) {
      this.setState({
        rounds: e.target.value
      })
      this.context.socket.emit('set-rounds', e.target.value)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.rounds !== nextProps.rounds) {
      this.setState({rounds: nextProps.rounds})
    }
  }

  render () {
    const {
      players,
      gameCode,
      gameOwnerId,
      isGameOwner
    } = this.props

    const {
      socket
    } = this.context

    let startGameComponent
    if (isGameOwner) {
      if (players.length < 2) {
        startGameComponent = <p className='info-text-bottom'>Det krävs minst 2 lag för att starta spelet.</p>
      } else {
        startGameComponent = <button className='button-big button-bottom' onClick={startGame.bind(null, socket)}>Starta Spel</button>
      }
    } else {
      startGameComponent = <p className='info-text-bottom'>Väntar på att {players.find(player => player.id === gameOwnerId).name} ska starta spelet!</p>
    }

    return (
      <div className='page lobby-page'>
        {isGameOwner
            ? <BackButton>Avsluta Spel</BackButton>
            : <BackButton>Lämna Spel</BackButton>
        }
        <input className='game-code' type='text' value={gameCode} readOnly />
        <span className='sub-note'>Bjud in andra med denna kod</span>
        <span className='top-note'>Antal omgångar per lag</span>
        <GameRoundsForm rounds={this.state.rounds} onChange={this.setRounds.bind(this)} disabled={!isGameOwner} />
        <ul className='players'>
          {players.map((player, index) => <li className='player-list-item' key={player.id}><span className='player-team'>Lag {index + 1}</span><span className='player-name'>{player.name}</span></li>)}
        </ul>
        {startGameComponent}
      </div>
    )
  }
}

LobbyPage.contextTypes = {
  socket: React.PropTypes.object
}

export default LobbyPage
