// server-side socket.io

const io = require('./index').io
const { VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED, LOGOUT, 
    COMMUNITY_CHAT, MESSAGE_RECEIVED, MESSAGE_SENT} = require('../Events')
const {createUser, creatMessage, createChat } = require('../Factories')

let connectedUsers = {}

let communityChat = createChat();

module.exports = function(socket){
    console.log("Socket Id: "+ socket.id); 

    let sendMessageToChatFromUser;

    // verify username
    socket.on( VERIFY_USER, (nickname, callback) => {
        console.log('verify user is firing from socket manager')
        if(isUser(connectedUsers, nickname)){
            callback({ isUser: true, user: null})
        } else {
            callback({ isUser: false, user:createUser({name:nickname})})
        }
    }) // loginform.js

    // user connects with username
    socket.on(USER_CONNECTED, (user) =>{
        connectedUsers = addUser(connectedUsers, user)
        socket.user = user;
        sendMessageToChatFromUser = sendMessageToChat(user.name)
        io.emit(USER_CONNECTED, connectedUsers)
        console.log("Connected to chat ",connectedUsers)
    })


    // user disconnects
    socket.on('disconnect', ()=>{
		if("user" in socket){
			connectedUsers = removeUser(connectedUsers, socket.user.name)

			io.emit(USER_DISCONNECTED, connectedUsers)
			console.log("Disconnect", connectedUsers);
		}
    })
    
    // user logout
    socket.on(LOGOUT, () =>{
        connectedUsers = removeUser(connectedUsers, socket.user.name)

		io.emit(USER_DISCONNECTED, connectedUsers)
		console.log("Disconnect", connectedUsers);
    })

    // get community chat
    socket.on(COMMUNITY_CHAT, (callback)=>{
        callback(communityChat)
    })

    socket.on(MESSAGE_SENT, ({chatId, message})=> {
        sendMessageToChatFromUser(chatId, message)
    })
}

    // send message
    function sendMessageToChat(sender){
        return(chatId, message) => {
            io.emit(`${MESSAGE_RECEIVED}-${chatId}`, creatMessage({message, sender}))
        }
    }

    // user logout

    // add user
    function addUser(userList, user){
        console.log(userList, user)
        let newList = Object.assign({}, userList);
        newList[user.name]=user;
        return newList;
    }


    // remove user
    function removeUser(userList, username) {
        let newList = Object.assign({}, userList)
        delete newList[username]
        return newList
    }
    // check if a user
    function isUser(userList, username) {
        return username in userList
    }

