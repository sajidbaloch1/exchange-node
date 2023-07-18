import mongoose from "mongoose";
import { encryptPassword } from "../lib/helpers/auth.js";
import softDeletePlugin from "./plugins/soft-delete.js";
import timestampPlugin from "./plugins/timestamp.js";
import { generateTransactionCode } from "../lib/helpers/transaction-code.js";

export const USER_ROLE = {
  SYSTEM_OWNER: "system_owner",
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  SUPER_MASTER: "super_master",
  MASTER: "master",
  AGENT: "agent",
  USER: "user",
};

export const USER_ACCESSIBLE_ROLES = {
  [USER_ROLE.SYSTEM_OWNER]: Object.values(USER_ROLE),

  [USER_ROLE.SUPER_ADMIN]: [
    USER_ROLE.ADMIN,
    USER_ROLE.SUPER_MASTER,
    USER_ROLE.MASTER,
    USER_ROLE.AGENT,
    USER_ROLE.USER,
  ],

  [USER_ROLE.ADMIN]: [
    USER_ROLE.SUPER_MASTER,
    USER_ROLE.MASTER,
    USER_ROLE.AGENT,
    USER_ROLE.USER,
  ],

  [USER_ROLE.SUPER_MASTER]: [USER_ROLE.MASTER, USER_ROLE.AGENT, USER_ROLE.USER],

  [USER_ROLE.MASTER]: [USER_ROLE.AGENT, USER_ROLE.USER],

  [USER_ROLE.AGENT]: [USER_ROLE.USER],

  [USER_ROLE.USER]: [],
};

const userSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "user",
    },
    cloneParentId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    hasChild: { type: Boolean, default: false },
    currencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "currency",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    isBetLock: { type: Boolean, default: false },
    isDemo: { type: Boolean, default: false },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    mobileNumber: { type: String, unique: true, sparse: true, default: null },
    city: { type: String },
    rate: { type: Number, min: 0, max: 100, default: 100 },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.USER,
    },
    creditPoints: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    exposureLimit: { type: Number, default: 0 },
    clientPl: { type: Number },
    forcePasswordChange: { type: Boolean, default: false },
    transactionCode: { type: String },
    remarks: String,
    lockPasswordChange: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.plugin(timestampPlugin);
userSchema.plugin(softDeletePlugin);

// Validate username to only have alphanumeric values and underscore
userSchema.path("username").validate(function (value) {
  return /^[a-zA-Z0-9_]+$/.test(value);
}, "Username can only contain alphanumeric characters or an underscore.");

// Validate username to only have alphanumeric values and underscore
userSchema.path("username").validate(async function (value) {
  const count = await this.constructor.countDocuments({
    _id: { $ne: this._id },
    username: value,
  });
  return count === 0;
}, "Username already exists. Please choose a different username.");

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  try {
    if (!user.isModified("password")) {
      return next();
    }
    const hashedPassword = await encryptPassword(user.password);
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Generate and encrypt transaction code before saving
userSchema.pre("save", async function (next) {
  const user = this;
  try {
    if (!user.transactionCode) {
      const transactionCodesInUse = await user.constructor
        .distinct("transactionCode")
        .exec();
      user.transactionCode = generateTransactionCode(transactionCodesInUse);
    } else if (!user.isModified("transactionCode")) {
      return next();
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("user", userSchema);

export default User;
