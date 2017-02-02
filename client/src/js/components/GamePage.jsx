import React, { Component } from 'react'
import PlayerGamePage from './PlayerGamePage.jsx'
import RefereeGamePage from './RefereeGamePage.jsx'

class GamePage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      running: false
    }

    setTimeout(() => this.setState({
      running: true
    }),
      this.props.roundStartTime - this.props.tss.offset() - Date.now()
    )

    this.renderGamePage = this.renderGamePage.bind(this)
  }

  renderGamePage () {

    const offset = this.props.tss.offset()

    if(this.props.isPlayerTurn) {
      return <PlayerGamePage
              synchronizeWith={this.props.roundStartTime - offset}
              offset={offset}
              roundTime={this.props.roundTime}
            />
    } else {
      return <RefereeGamePage />
    }
  }

  render () {

    return (
      <div>
        <h1>Game page</h1>

        {this.state.running
          ? this.renderGamePage()
          : <h3>Starting game..</h3>
        }
      </div>
    )
  }
}

export default GamePage
