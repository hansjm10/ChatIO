//Checks to see if the username is in a valid format. Must only include letters and numbers
//and be between 4-16 characters in length.
exports.checkUserValid = (username) => 
{
    var validLetters = /^[0-9a-zA-Z]+$/
    if(!(validLetters.test(username)))
    {
        return 2;
    }
    else if(username.length > 16 || username.length < 4)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}
//Checks the length on the password to make sure it is at least 6 characters long.
exports.checkPassValid = (password) =>
{
    if(password.length >= 6)
    {
        return true;
    }
    else
    {
        return false;
    }
}