import express from "express";
import currencyController from "../../../controllers/v1/currencyController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getAllCurrency", currencyController.getAllCurrency);
route(router, "post", "/getCurrencyById", currencyController.getCurrencyById);
route(router, "post", "/createCurrency", currencyController.createCurrency);
route(router, "post", "/updateCurrency", currencyController.updateCurrency);
route(router, "post", "/deleteCurrency", currencyController.deleteCurrency);

export default router;
