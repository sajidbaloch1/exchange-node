import express from "express";
import casinoController from "../../../controllers/v1/casinoController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getAllCasino", casinoController.getAllCasino);
route(router, "post", "/getCasinoById", casinoController.getCasinoById);
route(router, "post", "/createCasino", casinoController.createCasino);
route(router, "post", "/updateCasino", casinoController.updateCasino);
route(router, "post", "/deleteCasino", casinoController.deleteCasino);
route(router, "post", "/updateCasinoStatus", casinoController.updateCasinoStatus);

export default router;
