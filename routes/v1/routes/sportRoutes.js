import express from "express";
import sportController from "../../../controllers/v1/sportController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getAllSport", sportController.getAllSport);
route(router, "post", "/getSportById", sportController.getSportById);
route(router, "post", "/createSport", sportController.createSport);
route(router, "post", "/updateSport", sportController.updateSport);
route(router, "post", "/deleteSport", sportController.deleteSport);
route(router, "get", "/getBetCategory", sportController.getBetCategory);

export default router;
