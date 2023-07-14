import express from "express";

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import sportRoutes from "./sportRoutes.js";
import currencyRoutes from "./currencyRoutes.js";
import betCategoryRoutes from "./betCategoryRoutes.js";

var app = express();

app.use("/v1/auth", authRoutes);
app.use("/v1/users", userRoutes);
app.use("/v1/sport", sportRoutes);
app.use("/v1/currencies", currencyRoutes);
app.use("/v1/betCategories", betCategoryRoutes);

export default app;
