import mongoose from "mongoose";
import { encryptPassword } from "../lib/auth-helpers.js";

export const USER_ROLE = {
  SUPER_ADMIN: "superadmin",
  ADMIN: "admin",
  MASTER: "master",
  PLAYER: "player",
};

export const USER_ACCESSIBLE_ROLES = {
  [USER_ROLE.SUPER_ADMIN]: Object.values(USER_ROLE),

  [USER_ROLE.ADMIN]: [USER_ROLE.ADMIN, USER_ROLE.MASTER, USER_ROLE.PLAYER],

  [USER_ROLE.MASTER]: [USER_ROLE.MASTER, USER_ROLE.PLAYER],

  [USER_ROLE.PLAYER]: [],
};

export const USER_STATUS = {
  ACTIVE: "active",
  IN_ACTIVE: "inactive",
  SUSPENDED: "suspended",
  LOCKED: "locked",
};

const userSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "user",
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
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
    isDeleted: { type: Boolean, default: false }, // soft delete
  },
  { timestamps: true }
);

// Validate username to only have alphanumeric values and underscore
userSchema.path("username").validate(function (value) {
  return /^[a-zA-Z0-9_]+$/.test(value);
}, "Username can only contain alphanumeric characters or an underscore.");

// Pre hook for encrypting the password
userSchema.pre("save", async function (next) {
  const user = this;

  // If the password field has not been modified, move to the next middleware
  if (!user.isModified("password")) {
    return next();
  }

  try {
    const hashedPassword = await encryptPassword(user.password);
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("user", userSchema);

export default User;
