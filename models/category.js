import mongoose from "mongoose";
import softDeletePlugin from "./plugins/soft-delete.js";
import timestampPlugin from "./plugins/timestamp.js";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

categorySchema.plugin(timestampPlugin);
categorySchema.plugin(softDeletePlugin);

const Category = mongoose.model("category", categorySchema);

export default Category;
