import { Server } from "socket.io";
import { connect as connectPrivate } from "./namespaces/privateNamespace.js";
import { connect as connectPublic } from "./namespaces/publicNamespace.js";

const connections = [
  {
    namespace: "/io/private",
    connect: connectPrivate,
  },
  {
    namespace: "/io/public",
    connect: connectPublic,
  },
];

let io = null;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  connections.forEach((connection) => {
    const { namespace, connect } = connection;
    const namespaceIO = io.of(namespace);
    connect(namespaceIO);
  });
};

export { initSocket, io };
