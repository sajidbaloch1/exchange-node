import express from "express";
import withdrawGroupController from "../../../controllers/v1/withdrawGroupController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getAllWithdrawGroup", withdrawGroupController.getAllWithdrawGroup);
route(router, "post", "/getWithdrawGroupById", withdrawGroupController.getWithdrawGroupById);
route(router, "post", "/createWithdrawGroup", withdrawGroupController.createWithdrawGroup);
route(router, "post", "/updateWithdrawGroup", withdrawGroupController.updateWithdrawGroup);
route(router, "post", "/deleteWithdrawGroup", withdrawGroupController.deleteWithdrawGroup);
route(router, "post", "/updateWithdrawGroupStatus", withdrawGroupController.updateWithdrawGroupStatus);
route(router, "post", "/activeAllWithdrawGroup", withdrawGroupController.activeAllWithdrawGroup);

export default router;
