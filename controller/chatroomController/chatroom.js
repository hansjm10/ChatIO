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
//Following is an attempt to show which users are all in the chatroom that you join.
//Idea is maybe create an object for each room. Then in each object store pop in and out users.
//Another idea could be to use the database JSON to gather which users are in the room.
//But that seems a bit slower if I need to constantly access and update the database.
//Lets just try creating an object of rooms first.
class usersInChat {
    constructor(chatroomName, totalInRoom) {
        this.chatroomName = chatroomName;
        this.totalInRoom = totalInRoom;
    }
}
var usersInChatArray = [];
exports.getUsersinChat = (socket, io) =>
{
    socket.on('joinRoom', function(roomInfo){
        var totalInRoom = 0;
        console.log("Added to room");
        if(usersInChatArray.length == 0)
        {

        }
        //Going to get a null pointer exception if there are no users in the chatroom.
        for(var i=0; i<usersInChatArray.length; i++)
        {
            if(roomInfo.id == usersInChatArray[i].chatroomName){
                totalInRoom = usersInChatArray[i].totalInRoom + 1;
            }
            else
            {
                totalInRoom = totalInRoom;
            }
        }
        var chatRoomPop = new usersInChat(roomInfo.id,totalInRoom);
        usersInChatArray.push(chatRoomPop);
        console.log(usersInChatArray);
    });

    //An attempt to disconnect and remove the user from the room.
    //One idea is to fire a leaving script when the user closes or leaves the page on clientside.
    socket.on('disconnecting', function(){
        console.log("user disconnected");
    })
}
exports.getRoom = () => {
    return room;
}