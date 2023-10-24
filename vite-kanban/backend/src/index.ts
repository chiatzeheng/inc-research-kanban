import express from "express";
import cors from "cors";
import { Server as HttpServer } from "http";
import { Novu } from "@novu/node";
import { Server as SocketIOServer } from "socket.io";
import { Redis } from "ioredis";

const port = 5000
const r = new Redis(); 
const app = express();
const http = new HttpServer(app);
const novu = new Novu('622f8844a8496360724fbfdf0fa62183');
const socketIO = new SocketIOServer(http, {
  cors: {
    origin: "http://localhost:5000",
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/uploadDataToRedis', async (req, res) => {
  const data = req.body;
  await r.set('myDataKey', JSON.stringify(data));
  res.send('Data uploaded to Redis');
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
