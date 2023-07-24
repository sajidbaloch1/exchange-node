import express from "express";
import competitionController from "../../../controllers/v1/competitionController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getAllCompetition", competitionController.getAllCompetition);
route(router, "post", "/getCompetitionById", competitionController.getCompetitionById);
route(router, "post", "/createCompetition", competitionController.createCompetition);
route(router, "post", "/updateCompetition", competitionController.updateCompetition);
route(router, "post", "/deleteCompetition", competitionController.deleteCompetition);

export default router;
