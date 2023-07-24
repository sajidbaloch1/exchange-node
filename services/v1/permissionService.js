import CryptoJS from "crypto-js";
import mongoose from "mongoose";
import { appConfig } from "../../config/app.js";
import AppModule, { APP_MODULES } from "../../models/v1/AppModule.js";
import Permission from "../../models/v1/Permission.js";

const encryptModules = (modulesObj) => {
  const modules = JSON.stringify(modulesObj);
  const encryptedModules = CryptoJS.AES.encrypt(
    modules,
    appConfig.PERMISSIONS_AES_SECRET
  );
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

const fetchUserPermissions = async ({ userId }) => {
  try {
    const permission = await Permission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      { $unwind: "$modules" },
      {
        $match: {
          "modules.active": true,
        },
      },
      {
        $lookup: {
          from: "app_modules",
          localField: "modules.moduleId",
          foreignField: "_id",
          as: "appModules",
          pipeline: [{ $project: { key: 1 } }],
        },
      },
      {
        $project: {
          activeModules: {
            $map: {
              input: "$appModules",
              as: "module",
              in: "$$module.key",
            },
          },
        },
      },
    ]);

    if (permission.length) {
      const encryptedModules = encryptModules(permission[0].activeModules);
      return encryptedModules;
    }

    return "";
  } catch (e) {
    throw new Error(e.message);
  }
};

const setUserPermissions = async ({ userId, moduleIds }) => {
  try {
    const newPermissions = {
      userId: userId,
      modules: moduleIds.map((id) => ({
        moduleId: new mongoose.Types.ObjectId(id),
        active: true,
      })),
    };

    const createdUserPermissions = await Permission.create(newPermissions);

    return createdUserPermissions;
  } catch (e) {
    throw new Error(e.message);
  }
};

const appModuleListing = async () => {
  try {
    const appModule = await AppModule.find({}, { name: 1 });
    return appModule;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  fetchAppModules,
  fetchUserPermissions,
  setUserPermissions,
  appModuleListing,
};
