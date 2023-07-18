import mongoose from "mongoose";
import timestampPlugin from "../plugins/timestamp.js";

export const APP_MODULES = {
  USER_MODULE: "user_module",
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
