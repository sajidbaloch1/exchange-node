import express from "express";
import themeSettingController from "../../../controllers/v1/themeSettingController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getThemeSettingById", themeSettingController.getThemeSettingById);
route(router, "post", "/createThemeSetting", themeSettingController.createThemeSetting);
route(router, "post", "/updateThemeSetting", themeSettingController.updateThemeSetting);

export default router;
