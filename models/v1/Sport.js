import mongoose from "mongoose";
import softDeletePlugin from "../plugins/soft-delete.js";
import timestampPlugin from "../plugins/timestamp.js";

const sportSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },

  apiSportId: { type: Number, default: null },

  isActive: { type: Boolean, default: true },

  marketCount: { type: Number, default: 0 },
});

sportSchema.plugin(timestampPlugin);
sportSchema.plugin(softDeletePlugin);

const Sport = mongoose.model("sport", sportSchema);

export default Sport;
