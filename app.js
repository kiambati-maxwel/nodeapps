const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// ---- connect

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/myproject';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
MongoClient.connect(url, {
    useUnifiedTopology: true }, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);


  const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('chats');
    // Insert some documents
    collection.insertMany([
      {name: "max"}, {message: "hello"}
    ], function(err, result) {
      assert.equal(err, null);
      assert.equal(2, result.result.n);
      assert.equal(2, result.ops.length);
      console.log("Inserted 2 documents into the collection");
      callback(result);
    });
  }
 
  insertDocuments(db, function() {
    client.close();
  });

  client.on('connection', function (socket){


    // create a function to send status
    sendStatus = s => {
        socket.emit('status', s);
    }

    // get chats from mongo collection 

    chat.find().limit(100).toArray((err, res) => {

        if (err) {
            throw err;
        }

        // emit the message
        socket.emit('output', res);

    });

    // handle input events
    socket.on('input', data => {
        let name = data.name;
        let message = data.message;

        // check for name and message
        if (name == '' || message == '') {
            // send error status
            sendStatus('please enter a name and message');
        } else {
            // insert into database
            chat.insert({
                name: name,
                message: message
            }, () => {
                client.emit('output', [data]);


                // sendstatus ()

                sendStatus({
                    message: 'message sent',
                    clear: true
                });
            });


        }

    });

    // handle clear
    socket.on('clear', data => {
        // remove all chats from collection
        chat.remove({},()=>{
            // emit cleard
            socket.emit('cleared');

        })
    })

});


  // client.close();
});



// mongo.connect('mongodb://127.0.0.1:27017/myproject', {
//     useUnifiedTopology: true
// }, function (err, db) {

//     if (err) {

//         throw err;
//     }

//     console.log('mongo connected ----> ');

//     // connect to socket.io

//     client.on('connection', function(socket){
//         let chat = db.collection('chats');

//         // create a function to send status
//         sendStatus = s => {
//             socket.emit('status', s);
//         }

//         // get chats from mongo collection 

//         chat.find().limit(100).sort({
//             _id: 1
//         }).toArray((err, res) => {

//             if (err) {
//                 throw err;
//             }

//             // emit the message
//             socket.emit('output', res);

//         });

//         // handle input events
//         socket.on('input', data => {
//             let name = data.name;
//             let message = data.message;

//             // check for name and message
//             if (name == '' || message == '') {
//                 // send error status
//                 sendStatus('please enter a name and message');
//             } else {
//                 // insert into database
//                 chat.insert({
//                     name: name,
//                     message: message
//                 }, () => {
//                     client.emit('output', [data]);


//                     // sendstatus ()

//                     sendStatus({
//                         message: 'message sent',
//                         clear: true
//                     });
//                 });


//             }

//         });

//         // handle clear
//         socket.on('clear', data => {
//             // remove all chats from collection
//             chat.remove({},()=>{
//                 // emit cleard
//                 socket.emit('cleared');

//             })
//         })

//     });
// });