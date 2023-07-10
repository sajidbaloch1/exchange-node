import mongoose from "mongoose";

const sportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Sport = mongoose.model("sport", sportSchema);

export default Sport;
