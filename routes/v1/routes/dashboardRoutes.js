import express from "express";
import dashboardController from "../../../controllers/v1/dashboardController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getDashboardById", dashboardController.getDashboardById);

export default router;
