import React, { Component } from 'react'
import Countdown from './Countdown.jsx'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      game: {}
    }
  }

  componentDidMount () {
    const socket = this.props.socket

    socket.on('game.update', (game) => this.setState({
      ...this.state,
      game
    }))

    socket.on('game', (game) => this.setState({
      ...this.state,
      game
    }))
  }

  render () {
    const tss = this.props.tss

    switch (this.state.game.status) {
      case 'waitingforplayers':
        return null
        break

      case 'running':
        return <Countdown synchronizeWith={Date.now() - tss.offset()} startTime={60} />
        break

      default:
        return null
        break
    }
  }
}

App.propTypes = {
  tss: React.PropTypes.object.isRequired
}

export default App
