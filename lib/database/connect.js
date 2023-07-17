import mongoose from "mongoose";
import { appConfig } from "../../config/app.js";
import seed from "./seed.js";

const connect = async () => {
  await mongoose.connect(appConfig.MONGO_URL, {
    authSource: "admin",
  });

  await seed({ verbose: true });
};

export default connect;
