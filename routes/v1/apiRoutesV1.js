import express from "express";
import authRoutes from "./routes/authRoutes.js";
import betCategoryRoutes from "./routes/betCategoryRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import cronRoutes from "./routes/cronRoutes.js";
import currencyRoutes from "./routes/currencyRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import exchangeHomeRoutes from "./routes/exchangeHomeRoutes.js";
import sportRoutes from "./routes/sportRoutes.js";
import sportsBetCategoryRoutes from "./routes/sportsBetCategoryRoutes.js";
import themeSettingRoutes from "./routes/themeSettingRoutes.js";
import transactionActivityRoutes from "./routes/transactionActivityRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import userstakeRoutes from "./routes/userStakeRoutes.js";

const app = express();

app.use("/auth", authRoutes);
app.use("/cron", cronRoutes);
app.use("/users", userRoutes);
app.use("/sport", sportRoutes);
app.use("/stake", userstakeRoutes);
app.use("/currencies", currencyRoutes);
app.use("/betCategories", betCategoryRoutes);
app.use("/sportsBetCategories", sportsBetCategoryRoutes);
app.use("/competition", competitionRoutes);
app.use("/event", eventRoutes);
app.use("/exchangeHome", exchangeHomeRoutes);
app.use("/themeSetting", themeSettingRoutes);
app.use("/transactionActivity", transactionActivityRoutes);
app.use("/dashboard", dashboardRoutes);

export default app;
