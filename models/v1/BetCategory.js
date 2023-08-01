import mongoose from "mongoose";
import softDeletePlugin from "../plugins/soft-delete.js";
import timestampPlugin from "../plugins/timestamp.js";

export const DEFAULT_CATEGORIES = ["Match Odds", "Bookmaker", "Fancy"];

const betCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

betCategorySchema.plugin(timestampPlugin);
betCategorySchema.plugin(softDeletePlugin);

const BetCategory = mongoose.model("bet_category", betCategorySchema);

export default BetCategory;
