async function handleConnection(socket) {
  console.log("A user connected", socket.id);

  try {
    // socket.on("requestMarketId", (params) => {
    //   setInterval(async () => {
    //     const matchOddMethod = await socketController.getMatchOdds(params);
    //     socket.emit("getMatchOdds", matchOddMethod);
    //   }, 1000);
    // });
  } catch (e) {
    socket.emit("server_error", e.message);
    socket.disconnect(true);
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
}

export const connect = (socket) => {
  socket.on("connection", handleConnection);
};
