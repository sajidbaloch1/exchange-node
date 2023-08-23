import mongoose from "mongoose";
import timestampPlugin from "../plugins/timestamp.js";

const BET_ORDER_TYPE = {
  MARKET: "market",
  LIMIT: "limit",
};

const BET_ORDER_STATUS = {
  PENDING: "pending",
  PLACED: "placed",
  CANCELLED: "cancelled",
};

const BET_RESULT_STATUS = {
  RUNNING: "running",
  WON: "won",
  LOST: "lost",
  VOID: "void",
  CASH_OUT: "cash_out",
};

const betSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

  marketId: { type: mongoose.Schema.Types.ObjectId, ref: "market", required: true },

  // Any match or fancy
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "event", required: true },

  runnerId: { type: mongoose.Schema.Types.ObjectId, ref: "runner", required: true },

  // odd rate of bet
  odds: { type: Number, required: true },

  // stake amount (points)
  stake: { type: Number, required: true },

  // back or lay
  isBack: { type: Boolean, required: true },

  //Runner ID on which runner we are betting
  runnerId: { type: mongoose.Schema.Types.ObjectId },

  betOrderType: { type: String, enum: Object.values(BET_ORDER_TYPE), required: true },

  betOrderStatus: { type: String, enum: Object.values(BET_ORDER_STATUS), required: true },

  betResultStatus: { type: String, enum: Object.values(BET_RESULT_STATUS), required: true },

  betPl: { type: Number, required: true },

  deviceInfo: { type: String, required: true },

  ipAddress: { type: String, required: true },

  marketRunnerId: { type: mongoose.Schema.Types.ObjectId, ref: "market_runner", required: true },
});

betSchema.plugin(timestampPlugin);

betSchema.index({ userId: 1, marketId: 1, eventId: 1 });
betSchema.index({ userId: 1, betOrderStatus: 1, createdAt: 1 });
betSchema.index({ userId: 1, betOrderType: 1, createdAt: 1 });
betSchema.index({ userId: 1, betResultStatus: 1, createdAt: 1 });

const Bet = mongoose.model("bet", betSchema);

export default Bet;
