import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import tss from 'timesync-socket/client'
import GamePage from './GamePage.jsx'
import LobbyPage from './LobbyPage.jsx'
import WelcomePage from './WelcomePage.jsx'
import BeforeRoundPage from './BeforeRoundPage.jsx'
import FinishedPage from './FinishedPage.jsx'

import 'react-fastclick'

const window = window || global

window.tss = tss

const gameStatusOrder = {
  undefined: 0,
  'waitingforplayers': 1,
  'idle': 2,
  'running': 3,
  'finished': 4
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      game: props.game || {},
      player: props.player || {},
      config: props.config || {},
      words: [],
      connected: true,
      socket: undefined,
      pageTransitionName: ''
    }

    this.getPage = this.getPage.bind(this)
    this.onGameUpdate = this.onGameUpdate.bind(this)
  }

  getChildContext () {
    return {
      socket: this.state.socket
    }
  }

  setupSocket (socket) {
    // Setup time sync
    tss.setup(socket, { interval: 300, idleInterval: 4000 })

    socket.on('connect', () => {
      if (this.state.connected === false) {
        window.location.reload()
      }
    })

    socket.on('disconnect', () => this.setState({
      ...this.state,
      connected: false
    }))

    socket.on('game.update', game => {
      if (window.cordova && window.TapticEngine) {
        if (this.state.game.wordIndex !== game.wordIndex) {
          window.TapticEngine.impact({style: 'light'})
        }
      }

      this.onGameUpdate(game)
    })

    socket.on('game.add', game => {
      this.onGameUpdate(game)
    })

    socket.on('game.remove', id => {
      this.onGameUpdate({})
    })

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

  onGameUpdate (game) {
    const stateUpdate = {
      game
    }

    if (game.status !== this.state.game.status) {
      stateUpdate['pageTransitionName'] = (gameStatusOrder[this.state.game.status] < gameStatusOrder[game.status] ? 'pagePush' : 'pagePop')
    }

    this.setState({
      ...this.state,
      ...stateUpdate
    })
  }

  componentDidMount () {
    const onSocketSet = () => {
      window.socket = this.state.socket
      this.setupSocket(this.state.socket)
    }

    if (window.cordova) {
      this.setState({
        socket: io.connect('https://wow.oskarwalker.se') // eslint-disable-line no-undef
      }, onSocketSet)
    } else {
      this.setState({
        socket: io.connect() // eslint-disable-line no-undef
      }, onSocketSet)
    }

    window.app = this
  }

  getPage () {
    const tss = this.props.tss

    const isGameOwner = this.state.player.id === this.state.game.ownerId
    const isPlayerTurn = this.state.player.id === this.state.game.currentPlayerId

    switch (this.state.game.status) {
      case 'waitingforplayers':
        return <LobbyPage
          key='LobbyPage'
          players={this.state.game.players}
          gameCode={this.state.game.code}
          gameOwnerId={this.state.game.ownerId}
          isGameOwner={isGameOwner}
        />

      case 'running':
        return <GamePage
          key='GamePage'
          tss={tss}
          isPlayerTurn={isPlayerTurn}
          roundTime={this.state.config.roundTime}
          roundStartTime={this.state.game.roundStartTime}
          words={this.state.game.words}
          wordIndex={this.state.game.wordIndex}
        />

      case 'idle':
        return <BeforeRoundPage
          key='BeforeRoundPage'
          currentPlayerId={this.state.game.currentPlayerId}
          players={this.state.game.players}
          gameCode={this.state.game.code}
          isGameOwner={isGameOwner}
          isPlayerTurn={isPlayerTurn}
        />

      case 'finished':
        return <FinishedPage
          key='FinishedPage'
          players={this.state.game.endScore}
          isGameOwner={isGameOwner}
        />

      default:
        return <WelcomePage key='WelcomePage' />
    }
  }

  render () {
    const page = this.getPage()

    if (this.state.pageTransitionName) {
      return (
        <ReactCSSTransitionGroup
          transitionName={this.state.pageTransitionName}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {page}
        </ReactCSSTransitionGroup>
      )
    }

    return page
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
