let express = require('express')
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

let activeClient = [];
let temp;
const port = process.env.PORT || 3001;

server.listen(port, () => {
    console.log('started on port ' + port);

});

io.on('connection', (socket) => {
    socket.on('get-details', (username) => {
        activeClient.push({ name: username, id: socket.id })
        console.log(username + ' connected ' + ' with socket id -->' + socket.id);
        console.log(activeClient)
    })

    socket.on('join', (username) => {
        socket.join(username);
    });

    socket.on('get-clients', () => {
        io.emit('get-clients', JSON.stringify(activeClient));
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
        let details = JSON.parse(data);
        io.sockets.in(details.receiverName).emit('send-private-message', data);
    })

});

