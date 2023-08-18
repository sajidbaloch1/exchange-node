import express from "express";
import scriptController from "../../../controllers/v1/scriptController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getMatchOdds", scriptController.getMatchOdds, false);

export default router;