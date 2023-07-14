import mongoose from "mongoose";
import { appConfig } from "../../config/app.js";

const connect = async () => {
  await mongoose.connect(appConfig.MONGO_URL, {
    authSource: "admin",
  });
};

export default connect;
