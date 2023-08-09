import express from "express";
import permissionController from "../../../controllers/v1/permissionController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getAppModulesList", permissionController.getAppModulesList);
route(router, "post", "/getDefaultUserPermissions", permissionController.getDefaultUserPermissions);
route(router, "post", "/getUserPermissionModules", permissionController.getUserPermissions);
route(router, "post", "/getUserActivePermissions", permissionController.getUserActivePermissions);

export default router;
