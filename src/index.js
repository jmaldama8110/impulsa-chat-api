"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const httpServer = (0, http_1.createServer)();
const port = process.env.PORT || 4076;
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*"
    }
});
io.on("connection", (socket) => {
    socket.on('client-message', (data) => {
        socket.broadcast.emit('server-message', data);
    });
});
httpServer.listen(port, function () {
    console.log('Socket server started at port ' + port);
});
