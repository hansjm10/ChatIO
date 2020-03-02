var room;
const {MessagesCollection} = require('../../models/userInput');
exports.chatRoomJoin = (socket) => 
{
    socket.on('join', function(data)
    {
        room = data;
        socket.join(data.id); //User will join the room.  
    });
}

exports.sendChat = (socket,io) => 
{
    socket.on('chat message', function(msg)
    {
        console.log("recieved")
        sentMessage = msg;
        io.to(room.id).emit('chat message', msg); //The message emits to all users which are in the room.        
    });
}
exports.saveMessage = (socket) => 
{
    socket.on('username', function(user)
    {
        {
            let messageCollect = new MessagesCollection( //Collection will update with all messages that get sent with the username.
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
        }
    })
}

exports.getRoom = () => {
    return room;
}