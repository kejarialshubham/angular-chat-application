var mongo = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/users";

let express = require('express')
let app = express();

let http = require('http')
let server = http.Server(app);

let socketIO = require('socket.io')
let io = socketIO(server);

let activeClient = [];
let allEmployees = [];
var db;
const port = process.env.PORT || 3001;
let adminID;

var Sentiment = require('sentiment');
var sentiment = new Sentiment();

server.listen(port, () => {
    console.log('started on port ' + port);

});
io.on('connection', (socket) => {

    mongo.connect(url, function (err, client) {
        db = client.db('local');
    })

    socket.on('check-user', username => {
        db.collection('users').findOne({ name: username }, function (findErr, result) {
            if (result == null) {
                io.sockets.in(socket.id).emit('failure');
            }
            else if (result.name == username) {
                activeClient.push({ name: username, id: socket.id });
                if (result.role == "admin") {
                    io.sockets.in(socket.id).emit('admin-success');
                }
                else {
                    io.sockets.in(socket.id).emit('success');
                }
            }
        });
    });

    socket.on('new-user', (name) => {
        db.collection('users').findOne({ name: name }, function (error, result) {
            if (result == null) {
                db.collection('users').insertOne({ name: name, role: "employee" });
                activeClient.push({ name: name, id: socket.id });
                io.sockets.in(socket.id).emit('add-new-user');
            } else {
                io.sockets.in(socket.id).emit('user-exist');
            }
        });
    });

    socket.on('get-all-users', () => {
        db.collection('users').find({ role: "employee" }, { _id: 0, name: 0 }).toArray(function (error, result) {
            allEmployees = result;
            io.sockets.in(socket.id).emit('received-all-users', JSON.stringify(allEmployees));
        });
    });

    // socket.on('get-details', (username) => {
    //     if (activeClient.length == 0) {
    //         activeClient.push({ name: username, id: socket.id });
    //     }

    //     else {
    //         let duplicateFlag = 0;
    //         for (i = 0; i < activeClient.length; i++) {
    //             if (username == activeClient[i].name) {

    //                 io.sockets.in(socket.id).emit('duplicate-user', username)
    //                 duplicateFlag = 1;
    //                 break;
    //             }
    //         }
    //         if (duplicateFlag != 1) {
    //             activeClient.push({ name: username, id: socket.id });

    //         }
    //     }
    // });

    socket.on('join', (username) => {
        socket.join(username);
    });

    socket.on('get-clients', () => {
        io.emit('get-clients', JSON.stringify(activeClient));
    })

    // socket.on('active-clients', () => {
    //     io.emit('active-clients', JSON.stringify(activeClient));
    // })
    socket.on('chat-message', (message) => {
        io.emit('chat-message', message);
    });

    socket.on('disconnect', (index) => {
        socket.disconnect(socket.id);

        for (i = 0; i < activeClient.length; i++) {
            if (activeClient[i].id == socket.id) {
                this.temp = activeClient[i].name
                activeClient.splice(i, 1);
            }
        }
        io.emit('delete-map', this.temp)
        io.emit('get-clients', JSON.stringify(activeClient));
    })

    socket.on('private-message', (data) => {
        let privateDetails = JSON.parse(data);
        var emotion = "";
        io.sockets.in(privateDetails.receiverName).emit('send-private-message', data);


        // var docx = sentiment.analyze(privateDetails.msg).score;
        // console.log(docx)
        // if (docx < 0) {
        //     emotion = 'Negative'
        // }
        // else if (docx = 0) {
        //     emotion = 'Neutral'
        // }
        // else {
        //     emotion = 'Positive'
        // }
        // privateDetails.emotion = emotion;
        // console.log(privateDetails.emotion)

    })

});

