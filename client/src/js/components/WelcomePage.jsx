import React, { Component } from 'react'
import TeamNameForm from './TeamNameForm.jsx'
import GameCodeForm from './GameCodeForm.jsx'
import DialogContainer from './DialogContainer.jsx'
import DialogContent from './DialogContent.jsx'

class WelcomePage extends Component {

  constructor (props) {
    super(props)

    this.onTeamNameChange = this.onTeamNameChange.bind(this)
    this.createNewGame = this.createNewGame.bind(this)

    this.onGameCodeChange = this.onGameCodeChange.bind(this)
    this.joinGame = this.joinGame.bind(this)

    this.dialogBoxOpen = this.dialogBoxOpen.bind(this)
    this.dialogBoxClose = this.dialogBoxClose.bind(this)

    this.state = {
      teamName: '',
      gameCode: '',
      isShowingModal: false
    }
  }

  onTeamNameChange (event) {
    this.setState({
      teamName: event.target.value
    })
  }

  onTeamNameSubmit (teamName) {

  }

  createNewGame () {
    if (this.state.teamName.length > 0) {
      this.context.socket.emit('create-new-game', this.state.teamName)
    }
  }

  onGameCodeChange (event) {
    this.setState({
      gameCode: event.target.value
    })
  }

  joinGame (e) {
    if (e) {
      e.preventDefault()
    }

    if (this.state.gameCode.length === 5 &&
       this.state.teamName.length > 0) {
      this.context.socket.emit('join-game', parseInt(this.state.gameCode), this.state.teamName)
    }
  }

  dialogBoxOpen () {
    if (window.cordova && window.TapticEngine) {
      window.TapticEngine.impact({style: 'light'})
    }

    this.setState({
      isShowingModal: true
    })
  }

  dialogBoxClose () {
    this.setState({
      isShowingModal: false
    })
  }

  render () {
    return (
      <div className='page welcome-page'>
        <TeamNameForm onChange={this.onTeamNameChange} />
        <div className='start-buttons'>
          <button className='button-big' disabled={this.state.teamName.length < 1} onClick={this.dialogBoxOpen}>Anslut till ett spel</button>
          <button className='button-big' disabled={this.state.teamName.length < 1} onClick={this.createNewGame}>Skapa nytt spel</button>
        </div>
        {this.state.isShowingModal &&
          <DialogContainer onClick={this.dialogBoxClose}>
            <DialogContent onCancel={this.dialogBoxClose} onOk={this.joinGame}>
              <div>
                <h2>Slå in spelkod för att ansluta</h2>
                <GameCodeForm onChange={this.onGameCodeChange} onSubmit={this.joinGame} />
              </div>
            </DialogContent>
          </DialogContainer>
        }
      </div>
    )
  }
}

WelcomePage.contextTypes = {
  socket: React.PropTypes.object
}

export default WelcomePage
