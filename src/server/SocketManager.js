// server-side socket.io

const io = require('./index').io
const { VERIFY_USER, USER_CONNECTED, LOGOUT} = require('../Events')
const {createUser, creatMessage, createChat } = require('../Factories')

let connectedUsers = {}

module.exports = function(socket){
    console.log("Socket Id: "+ socket.id); 

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
        connectedUsers = (connectedUsers, user)
        socket.user = user;
        console.log(connectedUsers)
    })


    // user disconnects
    // user logouts

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

}


