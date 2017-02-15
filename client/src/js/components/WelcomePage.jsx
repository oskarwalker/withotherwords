import React, { Component } from 'react'
import TeamNameForm from './TeamNameForm.jsx'
import GameCodeForm from './GameCodeForm.jsx'
import DialogContainer from './DialogContainer.jsx'
import DialogContent from './DialogContent.jsx'
import HelpDialogContainer from './HelpDialogContainer.jsx'

class WelcomePage extends Component {

  constructor (props) {
    super(props)

    this.onTeamNameChange = this.onTeamNameChange.bind(this)
    this.createNewGame = this.createNewGame.bind(this)

    this.onGameCodeChange = this.onGameCodeChange.bind(this)
    this.joinGame = this.joinGame.bind(this)

    this.dialogBoxOpen = this.dialogBoxOpen.bind(this)
    this.dialogBoxClose = this.dialogBoxClose.bind(this)

    this.helpDialogOpen = this.helpDialogOpen.bind(this)
    this.helpDialogClose = this.helpDialogClose.bind(this)

    this.state = {
      teamName: '',
      gameCode: '',
      isShowingModal: false,
      isShowingHelpDialog: false
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
    if (event.target.value.length <= 5) {
      this.setState({
        gameCode: event.target.value
      })
    }
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

  helpDialogOpen () {
    this.setState({
      isShowingHelpDialog: true
    })
  }

  helpDialogClose () {
    this.setState({
      isShowingHelpDialog: false
    })
  }

  render () {
    return (
      <div className='page welcome-page'>
        <h1 className='start-header'>MED ANDRA ORD</h1>
        <span className='info-link' onClick={this.helpDialogOpen}>Hur funkar det?</span>
        {this.state.isShowingHelpDialog &&
          <HelpDialogContainer onClick={this.helpDialogClose}>
            <div className='help-dialog-content'>
              <p>test</p>
              <button className='button-header button-right' onClick={this.helpDialogClose}>Stäng</button>
            </div>
          </HelpDialogContainer>
        }
        <TeamNameForm onChange={this.onTeamNameChange} />
        <div className='start-buttons'>
          <button className='button-big' disabled={this.state.teamName.length < 1} onClick={this.dialogBoxOpen}>Anslut till ett spel</button>
          <button className='button-big' disabled={this.state.teamName.length < 1} onClick={this.createNewGame}>Skapa nytt spel</button>
        </div>
        {this.state.isShowingModal &&
          <DialogContainer onClick={this.dialogBoxClose} error={this.props.showGameError}>
            <DialogContent onCancel={this.dialogBoxClose} onOk={this.joinGame}>
              <div>
                <h2>Slå in spelkod för att ansluta</h2>
                <GameCodeForm onChange={this.onGameCodeChange} onSubmit={this.joinGame} value={this.state.gameCode} />
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
