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
const loginController = require('../controller/loginController');
const chatroomController = require('../controller/chatroomController');

module.exports = (app) => {
   // var userID; //userID used throughout router. Saves the userID so future pages are able to display it. <-- Possible to get this from Session info.

    
    app.get('/', function(req,res){ //Directs the user to the login screen.
        res.render('index',{
            title: "ChatIO",
            error: "Please Login"
        })
    })
     app.post('/', loginController.loginUser)
        
 
    app.get('/create', (_req,res)=>{
        res.render('createAccount.ejs',{
            title: "ChatIO"
        });
    })
    
    app.post('/create', loginController.loginCreate)
    
    app.get('/chatroomCreate', (req,res)=>{
        res.render('createRoom.ejs',{
            title: "ChatIO",
            userID: req.session.userID
        })
    })

    app.post('/chatroom', chatroomController.chatroomCreate);

    app.get('/chatroom', chatroomController.chatroomSelection);
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
    app.post('/findMessages', chatroomController.chatroomSearch);
}
