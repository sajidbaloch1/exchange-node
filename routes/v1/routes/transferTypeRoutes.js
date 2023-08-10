import express from "express";
import transferTypeController from "../../../controllers/v1/transferTypeController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getAllTransferType", transferTypeController.getAllTransferType);
route(router, "post", "/getTransferTypeById", transferTypeController.getTransferTypeById);
route(router, "post", "/createTransferType", transferTypeController.createTransferType);
route(router, "post", "/updateTransferType", transferTypeController.updateTransferType);
route(router, "post", "/deleteTransferType", transferTypeController.deleteTransferType);
route(router, "post", "/updateTransferTypeStatus", transferTypeController.updateTransferTypeStatus);

export default router;
