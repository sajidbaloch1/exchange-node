import express from "express";
import moment from "moment";
import { appConfig } from "./config/app.js";
import corsMiddleware from "./middlewares/cors.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(corsMiddleware);

app.get("/", (req, res) => {
  res.json({
    message: "Hello from CA Exchange API!",
    metadata: {
      utc_time: moment().utc().format("DD-MM-YYYY HH:mm:ss z"),
      server_time: moment().format("DD-MM-YYYY HH:mm:ss"),
    },
  });
});

app.use("/users", userRoutes);

app.listen(appConfig.PORT, () => {
  console.log(`Server running on port: ${appConfig.PORT}`);
});
