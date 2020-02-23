const user = require('../../models/userInput');
const loginLogic = require('../../controller/loginController/login');
/*
        Will attempt to log the client into the program. Compares username and password based on whats in the database.
        TODO:
            1) Handle error better using express.
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
    let username = req.body.username;
    let usernameCheck = loginLogic.checkUserValid(username);
    console.log(usernameCheck);
    if(usernameCheck === 2)
    {
        return res.status(400).send(
            {
                message: "You've entered a character not allowed, please try again."
            });
    }
    else if(usernameCheck === 1)
    {
        return res.status(400).send(
            {
                message: "You're username must be between 4-16 characters in length"
            }
        );
    }
    else if(!loginLogic.checkPassValid(req.body.password))
    {
        return res.status(400).send(
            {
                message: "You're password must be longer than 8 characters"
            }
        );
    }
    else
    {
        let Login = new user.LoginCollection();
        Login.username = username;
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
}
