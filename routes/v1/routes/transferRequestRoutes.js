import express from "express";
import transferRequestController from "../../../controllers/v1/transferRequestController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getAllTransferRequest", transferRequestController.getAllTransferRequest);
route(router, "post", "/getTransferRequestById", transferRequestController.getTransferRequestById);
route(router, "post", "/createTransferRequest", transferRequestController.createTransferRequest);
route(router, "post", "/updateTransferRequest", transferRequestController.updateTransferRequest);
route(router, "post", "/deleteTransferRequest", transferRequestController.deleteTransferRequest);
route(router, "post", "/updateTransferRequestStatus", transferRequestController.updateTransferRequestStatus);

export default router;
