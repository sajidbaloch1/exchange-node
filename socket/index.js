import { Server } from "socket.io";
import marketNamespace from "./namespaces/market/marketNamespace.js";
import userNamespace from "./namespaces/user/userNamespace.js";

let io = {
  user: null,
  market: null,
};

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.user = io.of("/io/user");
  userNamespace.connect(io.user);

  io.market = io.of("/io/market");
  marketNamespace.connect(io.market);
};

export { initSocket, io };
