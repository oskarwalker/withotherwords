import React, { Component } from 'react'
import Countdown from './Countdown.jsx'

class GamePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      running: false
    }

    setTimeout(() => this.setState({
        running: true
      }),
      this.props.roundStartTime - this.props.tss.offset() - Date.now()
    )

  }

  render () {
    return (
      <div>
        <h1>Game page</h1>
        {this.state.running
          ? <Countdown synchronizeWith={this.props.roundStartTime - this.props.tss.offset()} roundTime={this.props.roundTime} />
          : <h3>Starting game..</h3>
        }
      </div>
    )
  }
}

export default GamePage
