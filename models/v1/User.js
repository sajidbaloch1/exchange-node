import mongoose from "mongoose";
import { encryptPassword } from "../../lib/helpers/auth.js";
import { generateTransactionCode } from "../../lib/helpers/transaction-code.js";
import softDeletePlugin from "../plugins/soft-delete.js";
import timestampPlugin from "../plugins/timestamp.js";

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

const userSchema = new mongoose.Schema({
  // Parent user ID. If null, user doesn't have a parent. This refers to the parent user in a hierarchical system.
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "user",
  },
  // Parent user ID which this user is cloned from. If a user is cloned, it points to the original user ID.
  cloneParentId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

  // Flag indicating whether the user has any child users.
  hasChild: { type: Boolean, default: false },

  // The currency ID which the user uses for transactions.
  currencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "currency",
    required: true,
  },

  // Flag to check if user account is active.
  isActive: { type: Boolean, default: true },

  // Flag to check if betting is locked for this user.
  isBetLock: { type: Boolean, default: false },

  // Flag to identify if the user is a demo user or a real user.
  isDemo: { type: Boolean, default: false },

  // Unique username for the user.
  username: { type: String, required: true, unique: true },

  // Password for the user, required for authentication.
  password: { type: String, required: true },

  // Full name of the user.
  fullName: { type: String, required: true },

  // Mobile number of the user. It is unique and optional (sparse).
  mobileNumber: { type: String, unique: true, sparse: true, default: null },

  // Country Code of the user.
  countryCode: { type: String, default: null },

  // City of the user.
  city: { type: String },

  // Commission percentage rate between a parent and user. Values range from 0 to 100, defaulting to 0.
  rate: { type: Number, min: 0, max: 100, default: 0 },

  // User's role in the system. Default role is 'USER'.
  role: {
    type: String,
    enum: Object.values(USER_ROLE),
    default: USER_ROLE.USER,
  },

  // Number of credit points user has. Default is 0.
  creditPoints: { type: Number, default: 0 },

  // User's account balance. Default is 0.
  balance: { type: Number, default: 0 },

  // The Profit or Loss of the client.
  userPl: { type: Number },

  // Flag indicating whether the user is forced to change password on next login. Default is false.
  forcePasswordChange: { type: Boolean, default: false },

  // Transaction code for user's financial transactions.
  transactionCode: { type: String },

  // Any additional remarks about the user.
  remarks: String,

  // Flag indicating whether the user can change their password. Default is false.
  lockPasswordChange: { type: Boolean, default: false },

  // One Time Password for operations like password recovery or account verification.
  otp: { type: String },

  // Referral code for the user, used for referral programs.
  referralCode: { type: String },

  // The device token for sending push notifications to the user's device.
  deviceToken: { type: String },

  // The type of device the user is using, such as 'Android' or 'iOS'.
  deviceType: { type: String, enum: ["Android", "iOS"] },

  // The user's exposure amount, representing the current amount of money at risk.
  exposure: { type: Number, default: 0 },

  // User's exposure limit. This represents the maximum amount the user is allowed to risk or bet.
  exposureLimit: { type: Number, default: 0 },

  // User's exposure percentage. This is the percentage of the user's total capital that is at risk.
  exposurePercentage: { type: Number, min: 0, max: 100, default: 0 },

  // User's stake limit. This is the maximum amount the user is allowed to bet on a single event.
  stakeLimit: { type: Number, default: 0 },

  // User's maximum profit. This is the highest profit amount the user can gain.
  maxProfit: { type: Number, default: 0 },

  // User's maximum loss. This is the highest loss amount the user can bear.
  maxLoss: { type: Number, default: 0 },

  // User's bonus. This can be promotional credits or other bonus amounts awarded to the user.
  bonus: { type: Number, default: 0 },

  // User's maximum stake. This is the highest amount the user is allowed to wager across all events.
  maxStake: { type: Number, default: 0 },

  // Only for SUPER_ADMIN
  domainUrl: { type: String, default: null },
  contactEmail: { type: String, default: null },
  availableSports: [{ type: mongoose.Schema.Types.ObjectId, ref: "sport" }],
});

userSchema.plugin(timestampPlugin);
userSchema.plugin(softDeletePlugin);

userSchema.index({ parentId: 1 });
userSchema.index({ cloneParentId: 1 });
userSchema.index({ currencyId: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isBetLock: 1 });
userSchema.index({ username: 1 });
userSchema.index({ mobileNumber: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1, role: 1 });

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
    if (user?.password) {
      const hashedPassword = await encryptPassword(user.password);
      user.password = hashedPassword;
    }
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
