/*
    This file serves as initiating the server. It connects to the router file and passes express to it. Also currently
    this index file sets up the chatroom logic for seperating users between rooms.
    Goals: 
        1)Move chatroom logic to dedicated controller.
        2)Overall cleanup the file.
        ChangeLog:
        2/22/2020 - Started cleaning the file up, moved all variables to the start of the file. Fixed indentation
        and readability issues.
        3/2/2020 - Moved all logic regarding socketIO to chatroom.js
*/
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const FileStore = require('session-file-store')(session)
const connectDB = require('./models/connectMongoDB');
var io = require('socket.io').listen(server);
const port = 3000;
const chatroomSockets = require("./controller/chatroomController/chatroom")
const router = require('./router/router')(app);

connectDB();

app.use(session(
    {
        secret: 'hunter2',
        resave: false,
        saveUninitialized: false,
        store: new FileStore(),
    }));
//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
    {
        extended:true
    }));
app.use(express.static('public'));//default path
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html',ejs.renderFile); // rendering url;

/*
Socket.IO allows for the client and server to ping messages between each other using .on()
The server is constantly listening for commands as well as the client.
*/

io.on('connection', function(socket)
{
    chatroomSockets.chatRoomJoin(socket);
    chatroomSockets.sendChat(socket,io);
    chatroomSockets.saveMessage(socket);
});
  
server.listen(port, () => 
    {
        console.log('Listening on port', port);
    });