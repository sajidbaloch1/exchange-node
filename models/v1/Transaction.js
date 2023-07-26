import mongoose from "mongoose";
import softDeletePlugin from "../plugins/soft-delete.js";
import timestampPlugin from "../plugins/timestamp.js";

const transactionSchema = new mongoose.Schema({
  points: {
    type: Number,
    required: true,
  },
  balancePoints: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["credit", "debit"], // The type can only be 'credit' or 'debit'
    required: true,
  },
  remark: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // References the 'User' model for the user who initiated the transaction.
    required: true,
  },
  fromId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // References the 'User' model for the user who is the recipient of the transaction.
    required: true,
  },
  fromtoName: {
    type: String,
    required: true,
  },
});

transactionSchema.plugin(timestampPlugin);
transactionSchema.plugin(softDeletePlugin);

const Transaction = mongoose.model("transaction", transactionSchema);

export default Transaction;
