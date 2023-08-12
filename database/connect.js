import mongoose from "mongoose";
import { appConfig } from "../config/app.js";
import seed from "./seed.js";

/**
 * Connects to the MongoDB database using Mongoose and performs seed operation.
 * @async
 * @returns {Promise<void>} A Promise that resolves when the connection and seed operation are complete.
 */
const connect = async () => {
  await mongoose.connect(appConfig.MONGO_URL, {
    authSource: "admin",
  });

  // Seed database
  await seed({ verbose: true });
};

export default connect;
