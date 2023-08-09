import mongoose from "mongoose";
import timestampPlugin from "../plugins/timestamp.js";

export const APP_MODULES = {
  // Account Permissions
  ACCOUNT_MODULE: "account_module",
  ACCOUNT_CREATE: "account_create",
  ACCOUNT_UPDATE: "account_update",
  ACCOUNT_DELETE: "account_delete",
  ACCOUNT_DEPOSIT: "account_deposit",
  ACCOUNT_WITHDRAW: "account_withdraw",

  // User Permission
  USER_MODULE: "user_module",
  USER_CREATE: "user_create",
  USER_UPDATE: "user_update",
  USER_DELETE: "user_delete",
  USER_STATUS_UPDATE: "user_status_update",
  USER_BET_UPDATE: "user_bet_update",

  // Theme User Permissions
  THEME_USER_MODULE: "theme_user_module",
  THEME_USER_CREATE: "theme_user_create",
  THEME_USER_UPDATE: "theme_user_update",
  THEME_USER_DELETE: "theme_user_delete",

  // Bank Permission
  BANK_MODULE: "bank_module",
  BANK_DEPOSIT: "bank_deposit",
  BANK_WITHDRAW: "bank_withdraw",

  // Report Permissions
  REPORT_MODULE: "report_module",
  REPORT_ACCOUNT_STATEMENT: "report_account_statement",
};

const appModuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true, enum: Object.values(APP_MODULES) },
});

appModuleSchema.plugin(timestampPlugin);

appModuleSchema.index({ key: 1 });

const AppModule = mongoose.model("app_module", appModuleSchema);

export default AppModule;
