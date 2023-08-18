import { Server } from "socket.io";
import { connect as connectPrivateNamespace } from "./namespaces/privateNamespace.js";
import { connect as connectPublicNamespace } from "./namespaces/publicNamespace.js";

const connections = [
  {
    namespace: "/io/private",
    connect: connectPrivateNamespace,
  },
  {
    namespace: "/io/public",
    connect: connectPublicNamespace,
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
