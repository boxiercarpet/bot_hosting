import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import cors from 'cors'
import dotenv from "dotenv";
dotenv.config();

import ftp from "./modules/ftp.js";
import sql from "./modules/sql.js";
import logger from "./modules/logger.js";
import api from "./modules/api.js";
import docker from "./modules/docker.js";
import { wsCheckToken } from "./modules/auth.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: "*"
});

sql.connect();

app.use(cors())
app.use(express.json())
app.use("/api", api);

app.use(express.static(path.join(process.cwd(), 'web/build')));
app.get("/*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "web/build", "index.html"));
});

io.use(wsCheckToken)

docker.getEvents((err, stream) => {
    if (err) {
      console.log('Error getting Docker events:', err);
      return;
    }
  
    stream.on('data', (event) => {
      const eventData = JSON.parse(event.toString());
  
      if (eventData.Type === 'container' && eventData.Action === 'start') {
        const user = eventData.Actor.Attributes.name.substring(4)
        io.in("user-"+user).fetchSockets().then(sockets => {
            for (const socket of sockets) {
                socket.emit("start")
                sendLogs(socket)
            };
        })
      }
    });
  
    stream.on('error', (err) => {
        console.log('Error reading Docker events stream:', err);
    });
});

function sendLogs(socket) {
    var container = docker.getContainer("bot-"+socket.user)

    container.inspect((err, data) => {
        if (!err) {
            const since = new Date(data.State.StartedAt).getTime() / 1000
            container.logs({ follow: true, stdout: true, stderr: true, since: since }, (err, stream) => {
                stream.setEncoding('utf8');

                stream.on('data', (data) => {
                    socket.emit("log", data
                        .split('\n')
                        .map(line => line.substring(8))
                        .join('\n'))
                });
    
                if (data.State.Running) {
                    stream.on('end', () => {
                        socket.emit("stop")
                    });
                }
            });
        }
    })
}

io.on("connection", (socket) => {
    logger.log("WS", socket.user+' connected')
    socket.join("user-"+socket.user)
    sendLogs(socket)
});

httpServer.listen(8080, () => logger.log("Server", "Listening on port 8080"));
