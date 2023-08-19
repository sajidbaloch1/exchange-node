import marketService from "../../../services/v1/marketService.js";

const marketCallback = {
  match_odds: marketService.getMatchOdds,
};

let intervals = {};

function removeInterval(marketId) {
  clearInterval(intervals[marketId]);
  delete intervals[marketId];
}

export async function startBroadcast(socket, market) {
  if (!market.id) return;

  // TODO: Add a check to see if the market is open and set the interval accordingly

  if (!intervals[market.id]) {
    intervals[market.id] = setInterval(async () => {
      const room = market.id.toString();
      const clients = socket.adapter.rooms.get(room)?.size > 0;
      console.log(Object.keys(intervals));

      if (clients) {
        const event = `market:${market.type}:${room}`;
        const data = await marketCallback[market.type](market.id);

        socket.to(room).emit(event, data[0]);
      } else {
        removeInterval(market.id);
      }
    }, 5000);
  }
}

export function clearEmptyIntervals(socket) {
  Object.keys(intervals).forEach((marketId) => {
    const room = marketId.toString();
    const clients = socket.adapter.rooms.get(room)?.size;
    if (clients === 0 || !intervals[marketId]) {
      removeInterval(marketId);
    }
  });
}
