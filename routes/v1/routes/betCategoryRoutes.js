import express from "express";
import betCategoryController from "../../../controllers/v1/betCategoryController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(
  router,
  "post",
  "/getAllBetCategory",
  betCategoryController.getAllBetCategory
);
route(
  router,
  "post",
  "/getBetCategoryById",
  betCategoryController.getBetCategoryById
);
route(
  router,
  "post",
  "/createBetCategory",
  betCategoryController.createBetCategory
);
route(
  router,
  "post",
  "/updateBetCategory",
  betCategoryController.updateBetCategory
);
route(
  router,
  "post",
  "/deleteBetCategory",
  betCategoryController.deleteBetCategory
);

export default router;
