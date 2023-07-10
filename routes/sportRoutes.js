import express from "express";
import sportController from "../controllers/sportController.js";
import { route } from "../lib/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getAllSports", sportController.getAllSport);
route(router, "post", "/getSportById", sportController.getSportById);
route(router, "post", "/createSport", sportController.createSport);
route(router, "post", "/updateSport", sportController.updateSport);
route(router, "post", "/deleteSport", sportController.deleteSport);

export default router;
