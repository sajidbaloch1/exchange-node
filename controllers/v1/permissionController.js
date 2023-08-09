import ErrorResponse from "../../lib/error-handling/error-response.js";
import permissionService from "../../services/v1/permissionService.js";

const getAppModulesList = async (req, res) => {
  const appModules = permissionService.fetchAppModules();

  return res.status(200).json({ success: true, data: appModules });
};

const getDefaultUserPermissions = async (req, res) => {
  const defaultPermissions = await permissionService.fetchDefaultUserPermissions();

  return res.status(200).json({ success: true, data: defaultPermissions });
};

const getUserPermissions = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ErrorResponse("User Id is required").status(401);
  }

  const permissions = await permissionService.fetchUserPermissions({ userId });

  return res.status(200).json({ success: true, data: permissions });
};

const getUserActivePermissions = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ErrorResponse("User Id is required").status(401);
  }

  const permissionModules = await permissionService.fetchUserActivePermissions({ userId });

  return res.status(200).json({ success: true, data: permissionModules });
};

export default {
  getAppModulesList,
  getDefaultUserPermissions,
  getUserPermissions,
  getUserActivePermissions,
};
