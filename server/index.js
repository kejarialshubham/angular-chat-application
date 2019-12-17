var mongo = require('mongodb').MongoClient;
var allUsers = [{ "name": "admin" }, { "name": "user" }]
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
            if (findErr) {
                console.log("Inside error");
                io.sockets.in(socket.id).emit('failure');
                console.log(findErr.name, findErr.code)
            }
            if (username == "admin") {
                activeClient.push({name:"admin",id:socket.id});
                io.sockets.in(socket.id).emit('admin-success');
            }
            else
                if (result.name == username) {
                    activeClient.push({ name: username, id: socket.id });
                    console.log(activeClient)
                    io.sockets.in(socket.id).emit('success');
                }
        });

    });

    socket.on('get-all-users',() => {
        db.collection('users').find({role:"employee"}).toArray(function(error,result){
            allEmployees = result;
            io.sockets.in(socket.id).emit('received-all-users',JSON.stringify(allEmployees));
        });
    });

    socket.on('get-details', (username) => {
        if (activeClient.length == 0) {
            activeClient.push({ name: username, id: socket.id });
            console.log(username + ' connected ' + ' with socket id -->' + socket.id);
            console.log(activeClient)
        }

        else {
            let duplicateFlag = 0;
            for (i = 0; i < activeClient.length; i++) {
                if (username == activeClient[i].name) {
                    console.log('duplicate name')
                    io.sockets.in(socket.id).emit('duplicate-user', username)
                    duplicateFlag = 1;
                    break;
                }
            }
            if (duplicateFlag != 1) {
                console.log('after duplicate event', duplicateFlag)
                activeClient.push({ name: username, id: socket.id });
                console.log(username + ' connected ' + ' with socket id -->' + socket.id);
                console.log(activeClient)
            }
        }
    });

    socket.on('join', (username) => {
        console.log('user joined', username, socket.id)
        socket.join(username);
    });

    socket.on('get-clients', () => {
        io.emit('get-clients', JSON.stringify(activeClient));
    })

    socket.on('active-clients', () => {
        io.emit('active-clients', JSON.stringify(activeClient));
    })
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
        console.log(privateDetails)
        var docx = sentiment.analyze(privateDetails.msg).score;
        console.log(docx)
        if (docx < 0) {
            emotion = 'Negative'
        }
        else if (docx = 0) {
            emotion = 'Neutral'
        }
        else {
            emotion = 'Positive'
        }
        privateDetails.emotion = emotion;
        console.log(privateDetails.emotion)
        io.sockets.in(privateDetails.receiverName).emit('send-private-message', data);
    })

});

