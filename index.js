const express = require('express');
const app = express();
const http = require('http').createServer(app);

const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const FileStore = require('session-file-store')(session)
const connectDB = require('./models/connectMongoDB');
var io = require('socket.io')(http);
const {messagesCollection} =  require('./models/userInput');
connectDB();
app.use(session({
    secret: 'hunter2',
    resave: false,
    saveUninitialized: false,
    store: new FileStore(),
}))
//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
const router = require('./router/router')(app);

const port = 3000;



app.use(express.static('public'));//default path
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html',ejs.renderFile); // rendering url;
var room;
/*
Socket.IO allows for the client and server to ping messages between each other using .on()
The server is constantly listening for commands as well as the client.
*/
io.on('connection', function(socket){
    let sentMessage;
    socket.on('join', function(data){
        room = data;
        socket.join(data.id); //User will join the room.
        
    })
    socket.on('chat message', function(msg){
        sentMessage = msg;
        io.to(room.id).emit('chat message', msg); //The message emits to all users which are in the room.
    })
    socket.on('username', function(user){
        let messageCollect = new messagesCollection({ //Collection will update with all messages that get sent with the username.
            message: sentMessage,
            username: user
        })
        messageCollect.save(function(err){
            if(err){
                console.log("Not Saved");
            }
        })
    })
})
  
http.listen(port, () => {
    console.log('Listening on port', port);
})