import React, { Component } from 'react';
import {VERIFY_USER} from '../Events'

export default class LoginForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            nickname: "",
            error: ""
        };
    }

    setUser = ({user, isUser}) => {
        if(isUser){
            this.setError("Sorry, that nickname is already taken.")
        } else {
            this.setError("")
            this.props.setUser(user)
        }
    }

    handleSubmit = (e) => {
        e.preventDefault() // submit only to client and not server
        const {socket} = this.props
        const {nickname} = this.state
        socket.emit(VERIFY_USER, nickname, this.setUser)
        console.log("handle submit fired and this.state.nickname= "+ this.state.nickname)
    }

    handleChange = (e) => {
        this.setState({nickname: e.target.value})
        console.log("text input change handler: " +this.state.nickname);
    }


    setError = (error) => {
        this.setState({error})
    }

  render() {
      const {nickname, error} = this.state
    return (
        <div className="login">
            <form onSubmit={this.handleSubmit} className="login-form">
            <label htmlFor="nickname">
                <h2>Got a nickname?</h2>
            </label>
            <input
                ref={(input)=> {this.textInput = input}}
                type="text"
                id="nickname"
                value={nickname}
                onChange={this.handleChange}
                placeholder={'Username'}
            />
            </form>
            <div className="error">{error? error:null}</div>
        </div>
    );
  }
}