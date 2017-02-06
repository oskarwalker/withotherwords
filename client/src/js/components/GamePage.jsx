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

    const {
      tss,
      roundStartTime,
      roundTime,
      words,
      wordIndex,
      isPlayerTurn,
    } = this.props

    const offset = tss.offset()
    const currentWord = this.getCurrentWord(words, wordIndex)

    if(isPlayerTurn) {
      return <PlayerGamePage
              synchronizeWith={roundStartTime - offset}
              offset={offset}
              roundTime={roundTime}
              currentWord={currentWord}
            />
    } else {
      return <RefereeGamePage
              synchronizeWith={roundStartTime - offset}
              offset={offset}
              roundTime={roundTime}
              currentWord={currentWord}
            />
    }
  }

  getCurrentWord (words, wordIndex) {
    const length = words.length
    const index = wordIndex - (Math.floor(wordIndex / length) * length)
    console.log(index)
    return words[index].word
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
