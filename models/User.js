// user.js
import mongoose from "mongoose";

export const USER_ROLE = {
  SUPER_ADMIN: "superadmin",
  ADMIN: "admin",
  MASTER: "master",
  PLAYER: "player",
};

const userSchema = new mongoose.Schema(
  {
    // Username field
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // Password field
    password: {
      type: String,
      required: true,
    },
    // Rate field (a number between 0 and 1)
    rate: {
      type: Number,
      min: 0,
      max: 1,
      required: true,
      default: 1,
    },
    // Role field (enum of predefined roles)
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.PLAYER,
    },
    // Balance field (default value of 0)
    balance: {
      type: Number,
      default: 0,
    },
    // Exposure limit field (default value of 0)
    exposureLimit: {
      type: Number,
      default: 0,
    },
    // Force password change field (default value of false)
    forcePasswordChange: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Enable automatic timestamps for createdAt and updatedAt
);

const User = mongoose.model("user", userSchema);

export default User;
