/*
    This file serves to routes the client throughout the webpage. It imports MongoDB collections which
    will be compared or displayed to the client.
    Goals: 
        1) Move logic to a controller file and import it in.
        2) Require password length and put constraints on username.
        3) Allow sessions to expire and add a logout button.
    Longterm Goal:
        1)Email verification

        Last updated: 2/20/2020


        ChangeLog:
        2/19/2020 - Commented throughout the file.
        2/20/2020 - Removed any unnecessary redirects.
                    Passwords are now securely stored in MongoDB through a hashing function.
            
*/
const user = require('../models/userInput');
//const {LoginCollection, ChatroomCollection, messagesCollection} =  require('../models/userInput');
module.exports = (app) => {
    var userID; //userID used throughout router. Saves the userID so future pages are able to display it. <-- Possible to get this from Session info.
    loginMessage = 'Please Login';
    app.get('/', function(req,res){ //Directs the user to the login screen.
        res.render('index',{
            title: "ChatIO",
            error: loginMessage
        })
    })
    
    /*
        Will attempt to log the client into the program. Compares username and password based on whats in the database.
        TODO:
            1) Handle error better using express.
            2) Limit username length 3-12 characters of only ASCII.
            3) Create mandatory password length.
        */
    app.post('/', function(req,res,next){
        
       user.LoginCollection.findOne({username: req.body.username}, //Attempts to find the username.
       function(err,results){
           if(results === null){ //If there is no username return an error.
               return res.status(400).send({
                    message: "User Not Found"
               })
           }
           else
           {
               if(results.validPassword(req.body.password)){ //Determines if the password is correct using the results found.
               userID = req.body.username;
               req.session.userID = userID;
               auth = true;
               res.redirect('/chatroom');
               }
            else 
            {
                return res.status(400).send({ //If the password is incorrect, will throw an incorrect password error.
                    message: "Incorrect Password"
                })
            }
           }
       })
    
    })
    app.get('/create', (_req,res)=>{
        loginMessage = "Please Login";
        res.render('createAccount.ejs',{
            title: "ChatIO"
        });
    })
    /*
        Will attempt to create a new account using a provided username and password which is currently stored and hashed in MongoDB.
    */
    app.post('/create', (req,res, next) => {
        
        let Login = new user.LoginCollection();
        Login.username = req.body.username;
        Login.setPassword(req.body.password);
        Login.save(function(err){
            if(err){
                next(err)
            } else{
            res.redirect('/')
            }
        })
    })
    /*
        This will create a new chatroom and store its name in the database.
        TODO: 
            1) Handle errors better using express.
            2) Stop chatrooms with same name being created.
            3) Add password support for chatrooms.
    */
    app.get('/chatroomCreate', (req,res)=>{
        res.render('createRoom.ejs',{
            title: "ChatIO",
            userID: req.session.userID
        })
    })
    app.post('/chatroom', (req,res, next)=>{
                let chatroom = new user.ChatroomCollection({
                chatroom: req.body.chatroom
            })
            chatroom.save(function(err){
                if(err){
                    next(err);
                } else{

                res.redirect('/chatroom');
                }
    })
})
    app.get('/chatroom', (_req,res, next)=>{
        user.ChatroomCollection.find({},function (err, results){
            if(err){
                next(err);
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
    /*
         Directs user to the chatroom. Currently any chatroom can be accessed by changing your URL.
         Not currently sure the solution to this will be other than to check if the chatroom exists in MongoDB
         and if not than redirect the client.
    */ 
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
    /*
        Search past messages. Not very elegant and requires a lot of work to be done. Not critical feature.
    */
    app.post('/findMessages',(req,res,next)=>{
        let msgFind = req.body.messageFind;
        
        messagesCollection.find({username: msgFind}, function(err,results){
            if(err){
                next(err)
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
