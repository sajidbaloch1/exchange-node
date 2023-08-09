import express from "express";
import transactionUserController from "../../../controllers/v1/transactionUserController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/createtransactionUser", transactionUserController.createTransactionUser);
route(router, "post", "/getAlltransactionUsers", transactionUserController.getAllTransactionUser);
route(router, "post", "/gettransactionUserById", transactionUserController.getTransactionUserById);
route(router, "post", "/updatetransactionUser", transactionUserController.updateTransactionUser);
route(router, "post", "/deletetransactionUser", transactionUserController.deleteTransactionUser);
route(router, "post", "/login", transactionUserController.loginTransactionUser, false);
route(router, "post", "/resetPassword", transactionUserController.resetPassword);

export default router;
