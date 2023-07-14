import express from "express";

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import currencyRoutes from "./currencyRoutes.js";
import betCategoryRoutes from "./betCategoryRoutes.js";
import ruleRoutes from "./ruleRoutes.js";

var app = express();

app.use("/v1/auth", authRoutes);
app.use("/v1/users", userRoutes);
app.use("/v1/categories", categoryRoutes);
app.use("/v1/currencies", currencyRoutes);
app.use("/v1/betCategories", betCategoryRoutes);
app.use("/v1/rules", ruleRoutes);

export default app;