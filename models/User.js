import mongoose from "mongoose";

export const USER_ROLE = {
  SUPER_ADMIN: "superadmin",
  ADMIN: "admin",
  MASTER: "master",
  PLAYER: "player",
};

const userSchema = new mongoose.Schema(
  {
    // Parent userid for this user
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    isActive: { type: Boolean, default: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rate: { type: Number, min: 0, max: 1, default: 1 },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.PLAYER,
    },
    balance: { type: Number, default: 0 },
    exposureLimit: { type: Number, default: 0 },
    forcePasswordChange: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;
