const mongoose = require('mongoose');

module.exports=() => {
    const connect = function(){
        mongoose.connect('mongodb://localhost:27017/admin', {
            dbName: 'user_input',
     } , (error) => {
            if(error) {
                console.log('MongoDB error', error);
            }
            else{
                console.log('MongoDb connected');
            }
        })
    }
    connect();

    mongoose.connection.on('error', (error) =>{
        console.error("MongoDB error", error);
    });

    mongoose.connection.on('disconnected', ()=> {
        console.error("Disconnectd MongoDB, try re-connect.");
        connect();
    })
}