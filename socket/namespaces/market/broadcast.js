import marketService from "../../../services/v1/marketService.js";

const marketGetters = new Map().set("match_odds", marketService.getMatchOdds);

const marketEmitters = new Map();

export const emitMarketData = async (socket, market) => {
  const getter = marketGetters.get(market.type);
  if (getter) {
    const result = await getter(market.id);
    const data = result[0];
    socket.to(`market:${market.id}`).emit(`market:data:${market.id}`, data);
  }
};

export async function startBroadcast(socket, market) {
  if (!market.id) return;

  if (!marketEmitters.has(market.id)) {
    // TODO: Add a check to see if the market is open and set the interval accordingly
    marketEmitters.set(
      market.id,
      setInterval(async () => await emitMarketData(socket, market), 1000)
    );
  }
}

export function clearEmptyEmitters(socket) {
  for (const [marketId, emitter] of marketEmitters.entries()) {
    const clients = socket.adapter.rooms.get(`market:${marketId}`)?.size;

    if (clients === 0) {
      clearInterval(emitter);
      marketEmitters.delete(marketId);
    }
  }
}
