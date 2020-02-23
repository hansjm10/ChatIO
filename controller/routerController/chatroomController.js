const user = require('../../models/userInput');

/*
        This will create a new chatroom and store its name in the database.
        TODO: 
            1) Handle errors better using express.
            2) Stop chatrooms with same name being created.
            3) Add password support for chatrooms.
    */
exports.chatroomCreate = (req,res,next) =>{
    let chatroom = new user.ChatroomCollection(
        {
            chatroom: req.body.chatroom
        });
    chatroom.save(function(err)
    {
        if(err)
        {
            next(err);
        } 
        else
        {
            res.redirect('/chatroom');
        }
    });
}
//Displays all of the chatrooms that are in the database, if there are none then the user is prompted to create one.
exports.chatroomSelection = (req,res,next) =>{
    user.ChatroomCollection.find({},function (err, results){
        if(err)
        {
            next(err);
        }
        else if(results)
        {
        var count = results.length;
        chatArea = results;
        res.render('chatSelection.ejs',
            {
            title: "ChatIO",
            chat: count,
            chatName: results
            })
        }
        else
        {
            res.redirect('/chatroomCreate');
        }
})
}

// Search past messages. Not very elegant and requires a lot of work to be done. Not critical feature.

exports.chatroomSearch = (req,res,next) => {
    let msgFind = req.body.messageFind;
    messagesCollection.find({username: msgFind}, function(err,results)
    {
        if(err)
        {
            next(err)
        }
        else if(results)
        {
            res.json({results});
        }
        else
        {
            console.log("No messages found");
        }
    });
}
