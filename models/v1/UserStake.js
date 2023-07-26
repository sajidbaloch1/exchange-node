import mongoose from "mongoose";
import softDeletePlugin from "../plugins/soft-delete.js";
import timestampPlugin from "../plugins/timestamp.js";

const stakeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  inputValues: [
    {
      priceLabel: {
        type: String,
        default: "1k",
      },
      priceValue: {
        type: Number,
        default: 1000,
      },
    },
    {
      priceLabel: {
        type: String,
        default: "2k",
      },
      priceValue: {
        type: Number,
        default: 2000,
      },
    },
    {
      priceLabel: {
        type: String,
        default: "5k",
      },
      priceValue: {
        type: Number,
        default: 5000,
      },
    },
    {
      priceLabel: {
        type: String,
        default: "10k",
      },
      priceValue: {
        type: Number,
        default: 10000,
      },
    },
    {
      priceLabel: {
        type: String,
        default: "20k",
      },
      priceValue: {
        type: Number,
        default: 20000,
      },
    },
    {
      priceLabel: {
        type: String,
        default: "25k",
      },
      priceValue: {
        type: Number,
        default: 25000,
      },
    },
    {
      priceLabel: {
        type: String,
        default: "50k",
      },
      priceValue: {
        type: Number,
        default: 50000,
      },
    },
    {
      priceLabel: {
        type: String,
        default: "75k",
      },
      priceValue: {
        type: Number,
        default: 75000,
      },
    },
  ],
});

stakeSchema.plugin(timestampPlugin);
stakeSchema.plugin(softDeletePlugin);

const Stake = mongoose.model("stake", stakeSchema);

export default Stake;
