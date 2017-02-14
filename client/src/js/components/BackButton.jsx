import React, { Component } from 'react'
import Confirm from './Confirm.jsx'

class BackButton extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showConfirm: false
    }
    
    this.onConfirm = this.onConfirm.bind(this)
    this.goBack = this.goBack.bind(this)
    this.onBackButtonClick = this.onBackButtonClick.bind(this)
  }

  onConfirm (confirmed) {
    if (confirmed === true) {
      this.goBack()
    } else {
      this.setState({
        showConfirm: false
      })
    }
  }

  goBack () {
    this.context.socket.emit('go-back')
  }

  onBackButtonClick (e) {
    this.setState({
      showConfirm: true
    })
  }  

  render () {
    const {
      children
    } = this.props

    return (
      <div className='back-button'>
        <svg version='1.1'
          xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink'
          x='0px' y='0px' width='84.1px' height='154px' viewBox='0 0 84.1 154'
          xmlSpace='preserve'>
          <polyline className='back-button-tick' points='80.5,150.4 7.1,77 80.5,3.5 ' />
        </svg>

        <button className='back-button-button' onClick={this.onBackButtonClick}>{children}</button>
        {this.state.showConfirm && <Confirm onConfirm={this.onConfirm}>{`Vill du ${children.toLowerCase()}?`}</Confirm>}
      </div>
    )
  }
}

BackButton.contextTypes = {
  socket: React.PropTypes.object
}

export default BackButton
