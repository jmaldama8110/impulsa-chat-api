import { createServer } from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import sgMail from '@sendgrid/mail';
import axios from 'axios';

import cors from 'cors';
import express from 'express';

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3001

const io = new Server(httpServer, {
  cors:{
    origin: "*"
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));


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

app.post('/test', async (req, res) => {
  



  const sendGridApiKey = process.env.SENDGRID_API_KEY as string;
  const sendGridApiUrl = process.env.SENDGRID_BASE_URL as string;
  sgMail.setApiKey( sendGridApiKey);

  try{
    if( !req.query.toEmail || !req.query.templateId){
      throw new Error('Missing some query param: toEmail or templateId')
    }

    const api = axios.create( {
      method: "post",
      url: "/v3/mail/send",
      baseURL: sendGridApiUrl,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${sendGridApiKey}`,
      }
    });

    const apiRes = await api.post('/v3/mail/send',{
      "from": { "email": "contact@aristanetworks.global" },
      "personalizations": [
      {
        "to": [ { "email": req.query.toEmail } ],
        "dynamic_template_data": {
            ...req.body
        }

      }
      ],
      "template_id": req.query.templateId
    });

    res.send('Ok');
  }
  catch(e:any) {
    console.log(e);

    res.status(400).send(e.message);
  }



})
