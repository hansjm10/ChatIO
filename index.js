/*
    This file serves as initiating the server. It connects to the router file and passes express to it. Also currently
    this index file sets up the chatroom logic for seperating users between rooms.
    Goals: 
        1)Move chatroom logic to dedicated controller.
        2)Overall cleanup the file.
        ChangeLog:
        2/22/2020 - Started cleaning the file up, moved all variables to the start of the file. Fixed indentation
        and readability issues.
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
var room;
const {messagesCollection} =  require('./models/userInput');

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

const router = require('./router/router')(app);



app.use(express.static('public'));//default path

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.engine('html',ejs.renderFile); // rendering url;

/*
Socket.IO allows for the client and server to ping messages between each other using .on()
The server is constantly listening for commands as well as the client.
*/

io.on('connection', function(socket){
    let sentMessage;
    socket.on('join', function(data)
    {
        room = data;
        socket.join(data.id); //User will join the room.    
    });
    socket.on('chat message', function(msg)
    {
        sentMessage = msg;
        io.to(room.id).emit('chat message', msg); //The message emits to all users which are in the room.
    });
    socket.on('username', function(user)
    {
        let messageCollect = new messagesCollection( //Collection will update with all messages that get sent with the username.
        { 
            message: sentMessage,
            username: user
        });
        messageCollect.save(function(err){
            if(err)
            {
                console.log("Not Saved");
            }
        });
    });
});
  
server.listen(port, () => 
    {
        console.log('Listening on port', port);
    });