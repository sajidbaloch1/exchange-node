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

const GEO_LOCATION_TYPE = {
  POINT: "Point",
};

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
  event: {
    type: String,
    enum: Object.values(USER_ACTIVITY_EVENT),
    required: true,
  },
  ipAddress: { type: String },
  description: { type: String },
  geoLocation: {
    type: {
      type: String,
      enum: [GEO_LOCATION_TYPE.POINT],
      default: GEO_LOCATION_TYPE.POINT,
    },
    coordinates: { type: [Number], default: [0, 0] },
  },
});

userActivitySchema.plugin(timestampPlugin);

userActivitySchema.index({ userId: 1 });
userActivitySchema.index({ evnet: 1 });
userActivitySchema.index({ geo_location: "2dsphere" });

const UserActivity = mongoose.model("user_activity", userActivitySchema);

export default UserActivity;
