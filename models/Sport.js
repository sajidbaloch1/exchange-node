import mongoose from "mongoose";
import softDeletePlugin from "./plugins/soft-delete.js";
import timestampPlugin from "./plugins/timestamp.js";

const sportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

sportSchema.plugin(timestampPlugin);
sportSchema.plugin(softDeletePlugin);

const Sport = mongoose.model("sport", sportSchema);

export default Sport;
