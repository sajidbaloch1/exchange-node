import express from "express";
import apiRoutesV1 from "./v1/apiRoutesV1.js";

const app = express();

app.use("/v1", apiRoutesV1);

export default app;
