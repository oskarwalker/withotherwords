import React, { Component } from 'react'
import 'react-fastclick'

class InputButton extends Component {

  constructor (props) {
    super(props)

    this.state = {
      open: false,
      inputValue: ''
    }
    this.textInput = undefined
    this.onButtonClick = this.onButtonClick.bind(this)
    this.inputOnChange = this.inputOnChange.bind(this)
  }

  onButtonClick (event) {
    if (this.state.open === false) {
      this.setState({open: true}, () =>
        setTimeout(() => this.textInput.focus(), 200)
      )
    } else {
      this.props.onSubmit(this.state.inputValue)
    }
  }

  inputOnChange (event) {
    this.setState({
      inputValue: event.target.value
    })
  }

  render () {
    const className = `button-input ${this.state.open ? 'input--open' : ''}`

    return (
      <div className={className}>
        <div className='button-wrapper'>
          <label>Lagnamn</label>
          <div className='inner-wrapper'>
            <input type='text' value={this.state.inputValue} ref={input => this.textInput = input} onChange={this.inputOnChange} />
            <button onClick={this.onButtonClick}>{this.state.open ? '→' : 'Nytt spel'}</button>
          </div>
        </div>
      </div>
    )
  }
}

export default InputButton
