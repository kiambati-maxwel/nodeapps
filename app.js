const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// ---- connect
mongo.connect( 'mongodb://127.0.0.1:27017/myproject',{ useUnifiedTopology: true },function (err, db) {
    
    if (err) {

        throw err;
    }

    console.log('mongo connected ----> ');
});