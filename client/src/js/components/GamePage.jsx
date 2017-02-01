import React, { Component } from 'react'
import GameTimer from './GameTimer.jsx'

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

    const offset = this.props.tss.offset()

    return (
      <div>
        <h1>Game page</h1>
        {this.state.running
          ? <GameTimer 
              synchronizeWith={this.props.roundStartTime - offset}
              offset={offset}
              roundTime={this.props.roundTime}
            />
          : <h3>Starting game..</h3>
        }
      </div>
    )
  }
}

export default GamePage
