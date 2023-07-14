import mongoose from "mongoose";
import softDeletePlugin from "./plugins/soft-delete.js";
import timestampPlugin from "./plugins/timestamp.js";

export const GAME_TYPE = {
  EXCHANGE: "exchange",
  CASINO: "casino"
};

const ruleSchema = new mongoose.Schema({
  gameType: {
    type: String,
    enum: Object.values(GAME_TYPE),
    required: true
  },
  casinoId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  sportsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sport",
  },
  betCatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "bet_category",
    require: true
  },
  notes: [{
    description: {
      type: String,
      require: true
    },
    highlight: {
      type: Boolean,
      require: true
    }
  }]
});

ruleSchema.plugin(timestampPlugin);
ruleSchema.plugin(softDeletePlugin);

const Rule = mongoose.model("rule", ruleSchema);

export default Rule;
