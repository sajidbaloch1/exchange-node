import mongoose from "mongoose";
import softDeletePlugin from "../plugins/soft-delete.js";
import timestampPlugin from "../plugins/timestamp.js";

const sportsBetCategorySchema = new mongoose.Schema({
  sportsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sport",
    require: true,
  },
  betCatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "bet_category",
    require: true,
  },
  maxBet: { type: Number, default: 0 },
  minBet: { type: Number, default: 0 },
  notes: [
    {
      description: {
        type: String
      },
      highlight: {
        type: Boolean
      },
    },
  ],
  betDelay: {
    type: Number, default: 0
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

sportsBetCategorySchema.plugin(timestampPlugin);
sportsBetCategorySchema.plugin(softDeletePlugin);

const SportsBetCategory = mongoose.model("sports_bet_category", sportsBetCategorySchema);

export default SportsBetCategory;
