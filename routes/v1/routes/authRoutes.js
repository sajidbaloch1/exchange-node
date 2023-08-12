import express from "express";
import authController from "../../../controllers/v1/authController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/login", authController.login, false);
route(router, "post", "/userLogin", authController.userlogin, false);
route(router, "post", "/register", authController.register, false);
route(router, "post", "/resetPassword", authController.resetPassword);

route(
  router,
  "post",
  "/s3test",
  async (req, res) => {
    return res.status(200).json({ message: "success" });
  },
  false
);

export default router;
