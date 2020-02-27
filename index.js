const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// ---- connect
// mongo.connect( 'mongodb://127.0.0.1:27017/myproject',{ useUnifiedTopology: true },function (err, db) {
    
//     if (err) {

//         throw err;
//     }

//     console.log('mongo connected ----> ');
// });

// ---connect to mongo

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
MongoClient.connect(url,{ useUnifiedTopology: true }  ,function(err, max) {
  assert.equal(null, err);


  console.log("Connected successfully to server");

    // connect to socket io 

    client.on('connection', function(socket){
      const db = max.db(dbName);
      const collection = db.collection('chats');

      // create function to send start

      sendstatus = (s) => {
        socket.emit('status', s); 
      }

      // ----- insert into



      // get chats from mongo db
     collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        
        socket.emit('output',docs)
        // callback(docs);

      });

    
    // handle input eventss
    socket.on('input', function(data) {
      let name = data.name;
      let message = data.message;

      // check for message 
      if(name == "" || message == ""){
        // dend error
        sendstatus('please enter a name and message')
      }else{
        // insert to db

        collection.insertMany([
          {name : name}, {message : message}
        ], function(err, result) {

          client.emit('output', [data]);
          assert.equal(err, null);
          assert.equal(2, result.result.n);
          assert.equal(2, result.ops.length);
          console.log("Inserted 2 documents into the collection");
          sendstatus({
            message: 'message sent',
            clear: true
          })
          // callback(result);
        });

      }

      // i   
    });
// handle clear
     socket.on('clear', (data) => {

      collection.remove({},()=>{
        socket.emit('cleard')
      })
     })

  // max.close();
});
   
});