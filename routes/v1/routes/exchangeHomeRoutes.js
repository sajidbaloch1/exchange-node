import express from "express";
import exchangeHomeController from "../../../controllers/v1/exchangeHomeController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "get", "/sportsList", exchangeHomeController.getSportsList, false);
export default router;