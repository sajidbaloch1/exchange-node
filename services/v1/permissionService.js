import CryptoJS from "crypto-js";
import mongoose from "mongoose";
import { appConfig } from "../../config/app.js";
import { defaultPermissions } from "../../lib/helpers/permissions.js";
import AppModule, { APP_MODULES } from "../../models/v1/AppModule.js";
import Permission from "../../models/v1/Permission.js";

const encryptModules = (modulesObj) => {
  const modules = JSON.stringify(modulesObj);
  const encryptedModules = CryptoJS.AES.encrypt(modules, appConfig.PERMISSIONS_AES_SECRET).toString();
  return encryptedModules;
};

const fetchAppModules = () => {
  try {
    const encryptedModules = encryptModules(APP_MODULES);
    return encryptedModules;
  } catch (e) {
    throw new Error(e.message);
  }
};

const existingUserPermissions = async ({ userId }) => {
  try {
    const permissions = await Permission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      { $unwind: "$modules" },
      {
        $project: {
          moduleId: "$modules.moduleId",
          isActive: "$modules.isActive",
          subModules: "$modules.subModules",
        },
      },
      {
        $lookup: {
          from: "app_modules",
          localField: "moduleId",
          foreignField: "_id",
          as: "appModule",
        },
      },
      {
        $unwind: "$appModule",
      },
      {
        $addFields: {
          key: "$appModule.key",
          name: "$appModule.name",
        },
      },
      {
        $unset: "appModule",
      },
      {
        $unwind: "$subModules",
      },
      {
        $lookup: {
          from: "app_modules",
          localField: "subModules.moduleId",
          foreignField: "_id",
          as: "subModules.appModule",
        },
      },
      {
        $unwind: "$subModules.appModule",
      },
      {
        $addFields: {
          "subModules.key": "$subModules.appModule.key",
          "subModules.name": "$subModules.appModule.name",
        },
      },
      {
        $unset: "subModules.appModule",
      },
      {
        $group: {
          _id: "$moduleId",
          key: { $first: "$key" },
          name: { $first: "$name" },
          isActive: { $first: "$isActive" },
          subModules: { $push: "$subModules" },
        },
      },
      { $sort: { name: 1 } },
    ]);

    return permissions;
  } catch (e) {
    throw new Error(e.message);
  }
};

const generateUserDefaultPermissions = async ({ userId }) => {
  try {
    const userPermission = {
      userId: userId,
      modules: [],
    };

    for (const permission of defaultPermissions) {
      const module = await AppModule.findOne({ key: permission.key });
      if (!module) {
        throw new Error(`Module with key ${permission.key} not found`);
      }

      const currentModule = {
        moduleId: module._id,
        isActive: permission.active,
        subModules: [],
      };

      if (permission.subModules?.length) {
        for (const subModule of permission.subModules) {
          const subModuleModule = await AppModule.findOne({ key: subModule.key });
          if (!subModuleModule) {
            throw new Error(`Module with key ${subModule.key} not found`);
          }

          currentModule.subModules.push({
            moduleId: subModuleModule._id,
            isActive: subModule.active,
          });
        }
      }

      userPermission.modules.push(currentModule);
    }

    if (userPermission.modules.length) {
      await Permission.create(userPermission);
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

const fetchUserPermissions = async ({ userId }) => {
  try {
    let permissions = await existingUserPermissions({ userId });

    if (!permissions.length) {
      await generateUserDefaultPermissions({ userId });
      permissions = await existingUserPermissions({ userId });
    }

    const encryptedPermissions = encryptModules(permissions);

    return encryptedPermissions;
  } catch (e) {
    throw new Error(e.message);
  }
};

const fetchUserActivePermissions = async ({ userId }) => {
  try {
    let activePermissions = [];

    const existingPermissions = await existingUserPermissions({ userId });

    if (existingPermissions.length) {
      for (const permission of existingPermissions) {
        if (permission.isActive) {
          activePermissions.push(permission.key);
        }

        if (permission.subModules?.length) {
          for (const subModule of permission.subModules) {
            if (subModule.isActive) {
              activePermissions.push(subModule.key);
            }
          }
        }
      }
    }

    const encryptedPermissions = encryptModules(activePermissions);

    return encryptedPermissions;
  } catch (e) {
    throw new Error(e.message);
  }
};

const setUserPermissions = async ({ userId, moduleIds }) => {
  try {
    for (const moduleId of moduleIds) {
      const module = await AppModule.findById(moduleId);
      if (!module) {
        continue;
      }
    }

    return true;
  } catch (e) {
    throw new Error(e.message);
  }
};

export default {
  fetchAppModules,
  fetchUserPermissions,
  fetchUserActivePermissions,
  setUserPermissions,
};
