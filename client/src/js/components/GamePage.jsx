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
      this.props.roundStartTime - (Date.now() - this.props.serverTimeOffset)
    )

    this.renderGamePage = this.renderGamePage.bind(this)
  }

  renderGamePage () {
    const {
      serverTimeOffset,
      roundStartTime,
      roundTime,
      words,
      wordIndex,
      isPlayerTurn
    } = this.props

    const currentWord = this.getCurrentWord(words, wordIndex)

    if (isPlayerTurn) {
      return <PlayerGamePage
        synchronizeWith={roundStartTime - serverTimeOffset}
        offset={serverTimeOffset}
        roundTime={roundTime}
        currentWord={currentWord}
            />
    } else {
      return <RefereeGamePage
        synchronizeWith={roundStartTime - serverTimeOffset}
        offset={serverTimeOffset}
        roundTime={roundTime}
        currentWord={currentWord}
      />
    }
  }

  getCurrentWord (words, wordIndex) {
    const length = words.length
    const index = wordIndex - (Math.floor(wordIndex / length) * length)
    return words[index]
  }

  render () {
    return (
      <div className='page game-page'>
        {this.state.running
          ? this.renderGamePage()
          : <h3>Starting game..</h3>
        }
      </div>
    )
  }
}

export default GamePage
