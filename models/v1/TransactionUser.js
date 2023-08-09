import mongoose from "mongoose";
import softDeletePlugin from "../plugins/soft-delete.js";
import timestampPlugin from "../plugins/timestamp.js";

const transactionUserSchema = new mongoose.Schema({

  // Super admin userid
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // References the 'User' model for the user.
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
});

transactionUserSchema.plugin(timestampPlugin);
transactionUserSchema.plugin(softDeletePlugin);

// Validate username to only have alphanumeric values and underscore
transactionUserSchema.path("username").validate(function (value) {
  return /^[a-zA-Z0-9_]+$/.test(value);
}, "Username can only contain alphanumeric characters or an underscore.");


const TransactionUser = mongoose.model("transaction_user", transactionUserSchema);

export default TransactionUser;
