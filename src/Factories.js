// Factory of Chat Functions 

const uuid4 = require('uuid/v4')

// create a user
const createUser = ({name=""} = {})=> (
    {
        id:uuid4(),
        name    
    }
)

// create message
const createMessage = ({message="", sender=""} = { }) => ({
    id: uuid4(),
    time:getTime(new Date(Date.now())),
    message,
    sender
})

// date with a format
const getTime = (date) => {
    return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
}

// create a chat / messages on chat box
const createChat = ({messages=[], name="Community", users=[]}= {}) => ({
    id:uuid4(),
    name,
    messages,
    users,
    typingUser:[]
})

module.exports = {
    createMessage,
    createChat,
    createUser
}