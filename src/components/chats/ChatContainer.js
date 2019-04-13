import React, { Component } from 'react'
import SideBar from './SideBar'
import {COMMUNITY_CHAT, MESSAGE_RECEIVED, MESSAGE_SENT, TYPING } from '../../Events'
import ChatHeading from './ChatHeading'
import Messages from '../messages/Messages'
import MessageInput from '../messages/MessageInput'

export default class ChatContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chats: [],
            activeChat: null
        };
    }

    // life cycle method of react
    componentDidMount(){
        const {socket} = this.props
        socket.emit(COMMUNITY_CHAT, this.resetChat)
    }

    // 
    resetChat = (chat) => {
        return this.addChat(chat,true)
    }

    // adds chat to the container, if reset is true removes all chats and sets the chat to the main chat
    addChat= (chat, reset) => {
        const {socket} = this.props
        const {chats} = this.state

        const newChats = reset ? [chat]: [...chats, chat]
        this.setState({chats:newChats})

        // to get events form that chat
        const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}`
        const typingEvent = `${TYPING}-${chat.id}`

        // event listener
        socket.on(typingEvent)
        socket.on(messageEvent, this.addMessageToChat(chat.id))
    }

    // adds message to chat with the chatId passed in
    addMessageToChat = (chatId) => {
        return message => {
            const {chats} = this.state
            let newChats = chats.map((chat)=>{
                if(chat.id === chatId)
                    chat.messages.push(message)
                return chat
            })
            this.setState({chats:newChats})
        }
    }

    sendMessage = (chatId, message) => {
        const {socket} = this.props
        socket.emit(MESSAGE_SENT, {chatId, message})
    }

    sendTyping = (chatId, isTyping) => {
        const {socket} = this.props
        socket.emit(TYPING, {chatId, isTyping})
    }

    setActiveChat = (activeChat) => {
        this.setState({activeChat})
    }

  render() {
      const { user, logout } = this.props
      const { chats, activeChat } = this.state


    return (
      <div className="container">
        <SideBar 
            logout={logout}
            chats= {chats}
            user= {user}
            activeChat={activeChat}
            setActiveChat={this.setActiveChat} 
        />
        <div className="chat-room-container">
        {
            activeChat !== null ? (
                <div className="chat-room">
                    <ChatHeading name={activeChat.name}/>
                    <Messages
                        messages={activeChat.messages}
                        user={user}
                        typingUsers={activeChat.typingUsers}/>
                    <MessageInput
                        sendMessage = {
                            (message) => {
                                this.sendMessage(activeChat.id, message)
                            }
                        }
                        sendTyping ={
                            (isTyping) => {
                                this.isTyping(activeChat.id, isTyping)
                            }
                        }
                        
                        />
                </div>
            ) : (
                <div className="chat-room choose">
                    <h3>Choose a chat!</h3>
                </div>
            )
        }
        </div>
      </div>
    )
  }
}