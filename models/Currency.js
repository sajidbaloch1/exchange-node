import mongoose from "mongoose";
import softDeletePlugin from "./plugins/soft-delete.js";
import timestampPlugin from "./plugins/timestamp.js";

const currencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  multiplier: {
    type: Number,
    default: 1,
  },
});

currencySchema.plugin(timestampPlugin);
currencySchema.plugin(softDeletePlugin);

const Currency = mongoose.model("currency", currencySchema);

export default Currency;
