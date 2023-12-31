import { emitMarketData, startBroadcast } from "./broadcast.js";

async function handleConnection(socket) {
  // console.log("A user connected", socket.id);
  try {
    // console.log("A user subscribed to market", socket.id);

    socket.on("join:market", async (market) => {
      socket.join(`market:${market.id}`);
      await emitMarketData(socket, market);
      await startBroadcast(socket, market);
    });
  } catch (e) {
    socket.emit("server_error", e.message);
    socket.disconnect(true);
  }
}

const connect = (socket) => {
  socket.on("connection", handleConnection);
  // socket.on("disconnect", () => clearEmptyEmitters(socket));
};

export default {
  connect,
};
