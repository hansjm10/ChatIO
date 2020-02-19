const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var loginSchema = new Schema({
    username: String,
    password: String,
    published_date:{
        type:Date,
        default:Date.now
    }
})

var chatrooms = new Schema({
    chatroom: String,
    published_date:{
        type:Date,
        default:Date.now
    }
})

var messages = new Schema({
    message: String,
    username: String,
    published_date:{
        type:Date,
        default:Date.now
    }
})

const LoginCollection = mongoose.model('loginSchema',loginSchema);
const ChatroomCollection = mongoose.model('chatrooms',chatrooms);
const messagesCollection = mongoose.model('messages', messages);
module.exports = {LoginCollection,ChatroomCollection,messagesCollection};

