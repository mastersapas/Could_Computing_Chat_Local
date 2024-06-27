
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin:
            [
                "https://green-desert-0e5c81503.5.azurestaticapps.net",
                "https://cloudcomputingchat.pt",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://cloudfrontend:3000",
                "cloudfrontend:3000"
            ],
        credentials: true
    },
    allowEIO3: true,
});

const { port, MongoDBConnectionString } = require("./config");
const PORT = process.env.PORT || port;

io.on('connection', (socket) => {
    //socket.broadcast.emit('hi');
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat_message', (msg) => {

        if(msg.name == "DELETE" && msg.msg == "DELETE"){
            msg.type = "DELETE"
        }else{
            msg.type = 'O'
        }

        console.log('message: ' + msg);

        socket.broadcast.emit('chat_message', msg);
    });

    socket.on('image', (image) => {

        console.log('image: ' + image.name);
        console.log('image: ' + image.url);

        socket.broadcast.emit('image', image);
    });
});

server.listen(PORT, () => {
    if (process.env.PORT) {
        console.log("Listening on: https://cloudcomputingwebsockets.azurewebsites.net");
    } else {
        console.log("Listening on: http://localhost: ", PORT);
    }
});