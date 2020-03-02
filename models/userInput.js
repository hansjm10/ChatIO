const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
const crypto = require('crypto');

var loginSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    published_date:{
        type:Date,
        default:Date.now
    },
    hash: String,
    salt: String
})

var chatrooms = mongoose.Schema({
    chatroom: String,
    published_date:{
        type:Date,
        default:Date.now
    }
})

var messages = mongoose.Schema({
    message: String,
    username: String,
    published_date:{
        type:Date,
        default:Date.now
    }
})

loginSchema.methods.setPassword = function(password){
    console.log("This is working");
    this.salt = crypto.randomBytes(16).toString('hex'); 

    this.hash = crypto.pbkdf2Sync(password, this.salt,  
    1000, 64, `sha512`).toString(`hex`); 
}

loginSchema.methods.validPassword = function(password) {
    console.log("validated password"); 
    var hash = crypto.pbkdf2Sync(password,  
    this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.hash === hash; 
}
const LoginCollection = mongoose.model('loginSchema',loginSchema);
const ChatroomCollection = mongoose.model('chatrooms',chatrooms);
const MessagesCollection = mongoose.model('messages', messages);
const User = module.exports = {LoginCollection,ChatroomCollection,MessagesCollection};

