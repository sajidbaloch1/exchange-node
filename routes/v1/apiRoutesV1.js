import express from "express";
import authRoutes from "./routes/authRoutes.js";
import currencyRoutes from "./routes/currencyRoutes.js";
import sportRoutes from "./routes/sportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import betCategoryRoutes from "./routes/betCategoryRoutes.js";
import sportsBetCategoryRoutes from "./routes/sportsBetCategoryRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

const app = express();

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/sport", sportRoutes);
app.use("/currencies", currencyRoutes);
app.use("/betCategories", betCategoryRoutes);
app.use("/sportsBetCategories", sportsBetCategoryRoutes);
app.use("/competition", competitionRoutes);
app.use("/event", eventRoutes);

export default app;
