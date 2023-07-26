import express from "express";
import authRoutes from "./routes/authRoutes.js";
import cronRoutes from "./routes/cronRoutes.js";
import currencyRoutes from "./routes/currencyRoutes.js";
import sportRoutes from "./routes/sportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import betCategoryRoutes from "./routes/betCategoryRoutes.js";
import sportsBetCategoryRoutes from "./routes/sportsBetCategoryRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import exchangeHomeRoutes from "./routes/exchangeHomeRoutes.js";
import themeSettingRoutes from "./routes/themeSettingRoutes.js";
import transactionActivityRoutes from "./routes/transactionActivityRoutes.js";

const app = express();

app.use("/auth", authRoutes);
app.use("/cron", cronRoutes);
app.use("/users", userRoutes);
app.use("/sport", sportRoutes);
app.use("/currencies", currencyRoutes);
app.use("/betCategories", betCategoryRoutes);
app.use("/sportsBetCategories", sportsBetCategoryRoutes);
app.use("/competition", competitionRoutes);
app.use("/event", eventRoutes);
app.use("/exchangeHome", exchangeHomeRoutes);
app.use("/themeSetting", themeSettingRoutes);
app.use("/transactionActivity", transactionActivityRoutes);

export default app;
