import React, { Component } from 'react'
import GamePage from './GamePage.jsx'
import LobbyPage from './LobbyPage.jsx'
import WelcomePage from './WelcomePage.jsx'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      game: {},
      words: [],
      connected: true,
    }
  }

  componentDidMount () {
    const socket = this.props.socket

    socket.on('connect', () => this.setState({
      ...this.state,
      connected: true,
    }))

    socket.on('disconnect', () => this.setState({
      ...this.state,
      connected: false,
    }))

    socket.on('game.update', game => this.setState({
      ...this.state,
      game,
    }))

    socket.on('game.add', game => this.setState({
      ...this.state,
      game,
    }))

    socket.on('game.remove', id => this.setState({
      ...this.state,
      game: {},
    }))

    socket.on('words', words => this.setState({
      ...this.state,
      words,
    }))
  }

  render () {
    const tss = this.props.tss

    switch (this.state.game.status) {
      case 'waitingforplayers':
        return <LobbyPage players={this.state.game.players} />
        break

      case 'running':
        return <GamePage tss={tss} />
        break

      default:
        return <WelcomePage />
        break
    }
  }
}

App.propTypes = {
  tss: React.PropTypes.object.isRequired
}

export default App
