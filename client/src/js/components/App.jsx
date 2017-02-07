import React, { Component } from 'react'
import tss from 'timesync-socket/client'
import GamePage from './GamePage.jsx'
import LobbyPage from './LobbyPage.jsx'
import WelcomePage from './WelcomePage.jsx'
import BeforeRoundPage from './BeforeRoundPage.jsx'
import FinishedPage from './FinishedPage.jsx'

import 'react-fastclick'
import 'whatwg-fetch'

const window = window || global

window.tss = tss

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      game: props.game || {},
      player: props.player || {},
      config: props.config || {},
      words: [],
      connected: true,
      socket: undefined
    }
  }

  getChildContext () {
    return {
      socket: this.state.socket
    }
  }

  setupSocket (socket) {
    // Setup time sync
    tss.setup(socket)

    socket.on('connect', () => {
      if (this.state.connected === false) {
        window.location.reload()
      }
    })

    socket.on('disconnect', () => this.setState({
      ...this.state,
      connected: false
    }))

    socket.on('game.update', game => this.setState({
      ...this.state,
      game
    }))

    socket.on('game.add', game => this.setState({
      ...this.state,
      game
    }))

    socket.on('game.remove', id => this.setState({
      ...this.state,
      game: {}
    }))

    socket.on('player.update', player => this.setState({
      ...this.state,
      player
    }))

    socket.on('player.add', player => this.setState({
      ...this.state,
      player
    }))

    socket.on('player.remove', player => this.setState({
      ...this.state,
      player: {}
    }))

    socket.on('words', words => this.setState({
      ...this.state,
      words
    }))

    socket.on('gameError', error => console.log(error))
  }

  componentDidMount () {
    const onSocketSet = () => {
      window.socket = this.state.socket
      this.setupSocket(this.state.socket)
    }

    if (window.cordova) {
      this.setState({
        socket: io.connect('https://wow.oskarwalker.se') // eslint-disable-line no-use-before-define
      }, onSocketSet)
    } else {
      this.setState({
        socket: io.connect() // eslint-disable-line no-use-before-define
      }, onSocketSet)
    }

    window.app = this
  }

  render () {
    const tss = this.props.tss

    const isGameOwner = this.state.player.id === this.state.game.ownerId
    const isPlayerTurn = this.state.player.id === this.state.game.currentPlayerId

    switch (this.state.game.status) {
      case 'waitingforplayers':
        return <LobbyPage
          players={this.state.game.players}
          gameCode={this.state.game.code}
          gameOwnerId={this.state.game.ownerId}
          isGameOwner={isGameOwner}
        />

      case 'running':
        return <GamePage
          tss={tss}
          isPlayerTurn={isPlayerTurn}
          roundTime={this.state.config.roundTime}
          roundStartTime={this.state.game.roundStartTime}
          words={this.state.game.words}
          wordIndex={this.state.game.wordIndex}
        />

      case 'idle':
        return <BeforeRoundPage
          currentPlayerId={this.state.game.currentPlayerId}
          players={this.state.game.players}
          gameCode={this.state.game.code}
          isGameOwner={isGameOwner}
          isPlayerTurn={isPlayerTurn}
        />

      case 'finished':
        return <FinishedPage />

      default:
        return <WelcomePage />
    }
  }
}

App.defaultProps = {
  tss
}

App.childContextTypes = {
  socket: React.PropTypes.object
}

module.exports = App
export default App
