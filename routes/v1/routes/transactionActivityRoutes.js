import express from "express";
import transactionActivityController from "../../../controllers/v1/transactionActivityController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getAllTransactionActivity", transactionActivityController.getAllTransaction);
route(router, "post", "/createTransaction", transactionActivityController.createTransaction);

export default router;
