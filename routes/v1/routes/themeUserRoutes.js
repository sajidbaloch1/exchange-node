import express from "express";
import themeUserController from "../../../controllers/v1/themeUserController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/createThemeUser", themeUserController.createThemeUser);
route(router, "post", "/getAllThemeUsers", themeUserController.getAllThemeUser);
route(router, "post", "/getThemeUserById", themeUserController.getThemeUserById);
route(router, "post", "/updateThemeUser", themeUserController.updateThemeUser);
route(router, "post", "/deleteThemeUser", themeUserController.deleteThemeUser);
route(router, "post", "/login", themeUserController.loginThemeUser, false);
route(router, "post", "/resetPassword", themeUserController.resetPassword);

export default router;
