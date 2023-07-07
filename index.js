import bodyParser from "body-parser";
import express from "express";
import moment from "moment";
import { appConfig } from "./config/app.js";
import corsMiddleware from "./middlewares/cors.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dbConnection from "./lib/db-connection.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(corsMiddleware);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Hello from CA Exchange API!",
    metadata: {
      utc_time: moment().utc().format("DD-MM-YYYY HH:mm:ss z"),
      server_time: moment().format("DD-MM-YYYY HH:mm:ss"),
    },
  });
});

dbConnection();

app.listen(appConfig.PORT, () => {
  console.log(`Server running on port: ${appConfig.PORT}`);
});
