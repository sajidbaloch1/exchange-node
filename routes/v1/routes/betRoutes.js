import express from "express";
import betController from "../../../controllers/v1/betController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/createBet", betController.createBet);

export default router;