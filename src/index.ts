import { createServer } from "http";
import { Server } from "socket.io";
import express from 'express';

const httpServer = createServer();
const port = process.env.PORT || 4076
const portApi = process.env.PORT || 3001;
const app = express();

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


app.get('/test', (req, res) => {
  res.send({
    message: 'Hello from api!'
  })
})
app.listen(portApi, ()=>{
  console.log('Server started at port: ' + portApi);
})
