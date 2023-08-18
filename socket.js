import { Server } from "socket.io";
import socketController from "./controllers/v1/socketController.js";

let io;

const connect = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });
  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on('requestMarketId', (params) => {
      setInterval(async () => {
        const matchOddMethod = await socketController.getMatchOdds(params);
        socket.emit('getMatchOdds', matchOddMethod);
      }, 1000);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

};

export { connect, io };


