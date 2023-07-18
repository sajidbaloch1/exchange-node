import express from "express";
import ruleController from "../../../controllers/v1/ruleController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getAllRule", ruleController.getAllRule);
route(router, "post", "/getRuleById", ruleController.getRuleById);
route(router, "post", "/createRule", ruleController.createRule);
route(router, "post", "/updateRule", ruleController.updateRule);
route(router, "post", "/deleteRule", ruleController.deleteRule);

export default router;
