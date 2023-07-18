import mongoose from "mongoose";
import timestampPlugin from "../plugins/timestamp.js";

export const USER_ACTIVITY_EVENT = {
  LOGIN: "login",
  LOGOUT: "logout",
  CREATED: "created",
  UPDATED: "updated",
  REGISTERED: "registered",
  PASSWORD_RESET: "password_reset",
};

const userActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    event: {
      type: String,
      enum: Object.values(USER_ACTIVITY_EVENT),
    },
    ipAddress: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamp: {
      type: Date,
    },
  }
);

userActivitySchema.plugin(timestampPlugin);

const UserActivity = mongoose.model("user_activity", userActivitySchema);

export default UserActivity;
