import mongoose from "mongoose";
import softDeletePlugin from "../plugins/soft-delete.js";
import timestampPlugin from "../plugins/timestamp.js";

const withdrawGroupSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // References the 'User' model for the user who initiated the transaction.
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    remark: {
        type: String,
    },
    commision: {
        type: Number,
        default: 0
    },
    minAmount: {
        type: Number,
        required: true
    },
    maxAmount: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

withdrawGroupSchema.plugin(timestampPlugin);
withdrawGroupSchema.plugin(softDeletePlugin);

const WithdrawGroup = mongoose.model("withdraw_group", withdrawGroupSchema);

export default WithdrawGroup;
