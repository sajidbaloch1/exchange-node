import mongoose from "mongoose";
import timestampPlugin from "./plugins/timestamp.js";

export const APP_MODULES = {
  BET_CATEGORY_MODULE: "bet_category_module",

  CURRENCY_MODULE: "currency_module",

  RULE_MODULE: "rule_module",

  SPORT_MODULE: "sport_module",

  USER_MODULE: "user_module",
};

const appModuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  key: {
    type: String,
    required: true,
    unique: true,
    enum: Object.values(APP_MODULES),
  },
});

appModuleSchema.plugin(timestampPlugin);

const AppModule = mongoose.model("app_module", appModuleSchema);

export default AppModule;
