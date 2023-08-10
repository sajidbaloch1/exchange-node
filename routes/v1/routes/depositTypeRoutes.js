import express from "express";
import depositTypeController from "../../../controllers/v1/depositTypeController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getAllDepositType", depositTypeController.getAllDepositType);
route(router, "post", "/getDepositTypeById", depositTypeController.getDepositTypeById);
route(router, "post", "/createDepositType", depositTypeController.createDepositType);
route(router, "post", "/updateDepositType", depositTypeController.updateDepositType);
route(router, "post", "/deleteDepositType", depositTypeController.deleteDepositType);
route(router, "post", "/updateDepositTypeStatus", depositTypeController.updateDepositTypeStatus);

export default router;
