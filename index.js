import bodyParser from "body-parser";
import express from "express";
import moment from "moment";
import { appConfig } from "./config/app.js";
import dbConnection from "./lib/app/db-connection.js";
import corsMiddleware from "./middlewares/corsMiddleware.js";
import apiRouter from "./routes/api.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(corsMiddleware);

app.use("/api/", apiRouter);

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
