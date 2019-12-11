let express = require('express')
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

let activeClient = [];
let temp;
const port = process.env.PORT || 3001;
var j = 0;

server.listen(port, () => {
    console.log('started on port ' + port);

});
io.on('connection', (socket) => {
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
        io.sockets.in(privateDetails.receiverName).emit('send-private-message', data);
    })

});

