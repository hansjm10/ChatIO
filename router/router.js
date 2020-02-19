const {LoginCollection, ChatroomCollection, messagesCollection} =  require('../models/userInput');
module.exports = (app) => {
    var userID;
    var auth;
    var chatArea;
    var msg;
    loginMessage = 'Please Login';
    app.get('/', function(req,res){
        res.render('index',{
            title: "ChatIO",
            error: loginMessage
        })
    })
    app.post('/', function(req,res){
       LoginCollection.findOne({username: req.body.username, password: req.body.password},
       function(err,results){
           if(err){
               console.log(err);
           }
           if(!results){
               loginMessage = "Incorrect login";
               res.redirect('/');

           }
           else{
               userID = req.body.username;
               req.session.userID = userID;
               auth = true;
               res.redirect('/chatroom');
           }
       })

    })
    app.get('/create', (req,res)=>{
        loginMessage = "Please Login";
        res.render('createAccount.ejs',{
            title: "ChatIO"
        });
    })
    app.post('/create', (req,res) => {
        
        let Login = new LoginCollection({
            username: req.body.username,
            password: req.body.password
        })
        Login.save(function(err){
            if(err){
                console.log("Not Saved");
                res.json({results:0});
            } else{
            res.redirect('/')
            }
        })
    })
    app.get('/chatroomCreate', (req,res)=>{
        res.render('createRoom.ejs',{
            title: "ChatIO",
            userID: req.session.userID
        })
    })
    app.post('/chatroom', (req,res)=>{
                let chatroom = new ChatroomCollection({
                chatroom: req.body.chatroom
            })
            chatroom.save(function(err){
                if(err){
                    console.log(err);
                    res.json({results:0});
                } else{

                res.redirect('/chatroom');
                }
    })
})
    app.get('/chatroom', (req,res)=>{
        ChatroomCollection.find({},function (err, results){
            if(err){
                console.log(err);
            }
            else if(results){
                var count = results.length;
            chatArea = results;
            res.render('chatSelection.ejs',{
            title: "ChatIO",
            chat: count,
            chatName: results
        })
            }
            else{
                res.redirect('/chatroomCreate');
    }
})
    })
    app.get('/chatArea/:id', (req,res)=>{
        res.render('chatroom.ejs',{
        title: "Room: " + req.params.id,
        userID: req.session.userID,
        id: req.params.id});
    })
    app.get('/findMessages',(req,res)=>{
        res.render('findMessage.ejs',{
            title: "ChatIO"
        })
    })
    app.post('/findMessages',(req,res)=>{
        let msgFind = req.body.messageFind;
        
        messagesCollection.find({username: msgFind}, function(err,results){
            if(err){
                console.log(err);
            }
            else if(results){
                res.json({results});
            }
            else{
                console.log("No messages found");
            }
        }
    )})
}
