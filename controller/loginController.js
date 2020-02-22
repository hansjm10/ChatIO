const user = require('../models/userInput');
/*
        Will attempt to log the client into the program. Compares username and password based on whats in the database.
        TODO:
            1) Handle error better using express.
            2) Limit username length 3-12 characters of only ASCII.
            3) Create mandatory password length.
        */
exports.loginUser = (req,res,next) => {
    user.LoginCollection.findOne({username: req.body.username}, //Attempts to find the username.
    function(err,results)
    {
        if(results === null) //If there is no username return an error.
        { 
            return res.status(400).send(
                {
                    message: "User Not Found"
                });
        }
        else
        {
            if(results.validPassword(req.body.password))//Determines if the password is correct using the results found.
                { 
                    userID = req.body.username;
                    req.session.userID = userID;
                    auth = true;
                    res.redirect('/chatroom');
                }
        else 
            {
            return res.status(400).send(//If the password is incorrect, will throw an incorrect password error.
                { 
                    message: "Incorrect Password"
                });
            }
        }
    });
}
/*
        Will attempt to create a new account using a provided username and password which is currently stored
        and hashed in MongoDB.
    */
exports.loginCreate = (req,res,next) => {
    let Login = new user.LoginCollection();
    Login.username = req.body.username;
    Login.setPassword(req.body.password);
    Login.save(function(err)
    {
        if(err)
        {
            next(err)
        } 
            else
        {
            res.redirect('/')
        }
    });
}
