import mongoose from "mongoose";
import timestampPlugin from "../plugins/timestamp.js";

export const APP_MODULES = {
  USER_MODULE: "user_module",
  USER_LIST: "user_list",
  USER_LOCK: "user_lock",
  USER_PASSWORD_CHANGE: "user_password_change",
  INSERT_USER: "insert_user",
  USER_HISTORY: "user_history",
  USER_INFO: "user_info",
  DASHBOARD: "dashboard",
  CURRENCY_MODULE: "currency_module",
};

const appModuleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  key: {
    type: String,
    required: true,
    unique: true,
    enum: Object.values(APP_MODULES),
  },
});

appModuleSchema.plugin(timestampPlugin);

appModuleSchema.index({ key: 1 });

const AppModule = mongoose.model("app_module", appModuleSchema);

export default AppModule;
