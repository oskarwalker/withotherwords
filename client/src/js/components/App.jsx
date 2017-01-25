import React, { Component } from 'react'
import tss from 'timesync-socket/client'
import GamePage from './GamePage.jsx'
import LobbyPage from './LobbyPage.jsx'
import WelcomePage from './WelcomePage.jsx'
import 'react-fastclick'
import 'whatwg-fetch'

const window = window || global

window.tss = tss

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      game: props.game || {},
      words: [],
      connected: true,
      socket: undefined
    }
  }

  setupSocket (socket) {
    // Setup time sync
    tss.setup(socket)

    socket.on('connect', () => {
      if(this.state.connected === false) {
        window.location.reload()
      }
    })

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

    socket.on('gameError', error => console.log(error))
  }

  componentDidMount () {

    const onSocketSet = () => {
      window.socket = this.state.socket
      this.setupSocket(this.state.socket)
    }

    if(window.cordova) {
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

App.defaultProps = {
  tss
}

module.exports = App
export default App
