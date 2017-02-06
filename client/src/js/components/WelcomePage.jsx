import React, { Component } from 'react'
import InputButton from './InputButton.jsx'
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

  joinGame () {
    if (this.state.gameCode.length === 5 &&
       this.state.teamName.length > 0) {
      this.context.socket.emit('join-game', parseInt(this.state.gameCode), this.state.teamName)
    }
  }

  dialogBoxOpen () {
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
      <div>
        <TeamNameForm onChange={this.onTeamNameChange} />
        <h2>Skapa nytt spel</h2>
        <button onClick={this.createNewGame}>Skapa nytt spel</button>
        <h2>Eller:</h2>
        <button onClick={this.dialogBoxOpen}>Anslut till ett spel</button>
        {this.state.isShowingModal &&
          <DialogContainer onClick={this.dialogBoxClose}>
            <DialogContent onCancel={this.dialogBoxClose} onOk={this.joinGame}>
              <div>
                <h2>Gå med i existerande spel</h2>
                <GameCodeForm onChange={this.onGameCodeChange} />
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
