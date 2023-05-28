import { createServer } from "http";
import { Server } from "socket.io";
import express from 'express';

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3001


const io = new Server(httpServer, {
  cors:{
    origin: "*"
  }
});


io.on("connection", (socket) => {
    socket.on('client-message',(data:any)=>{
    
      socket.broadcast.emit('server-message',data);
    })
  });

httpServer.listen(port, function (){
    console.log(`Socket server started at port ${port}`);
});

// Allows you to send emits from express
app.use(function (request:any, response, next) {
  request.io = io;
  next();
});

app.get('/test', (req, res) => {
  res.send({
    message: 'Hello from api!'
  })
})
