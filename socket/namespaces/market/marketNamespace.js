import { clearEmptyIntervals, startBroadcast } from "./broadcast.js";

async function handleConnection(socket) {
  console.log("A user connected", socket.id);

  try {
    socket.on("join", async (market) => {
      if (market.id) {
        socket.join(market.id);
        await startBroadcast(socket, market);
      }
    });
  } catch (e) {
    socket.emit("server_error", e.message);
    socket.disconnect(true);
  }

  socket.on("disconnect", () => {
    clearEmptyIntervals(socket);
    console.log("A user disconnected", socket.id);
  });
}

const connect = (socket) => {
  socket.on("connection", handleConnection);
};

export default {
  connect,
};
