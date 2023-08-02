import CryptoJS from "crypto-js";
import mongoose from "mongoose";
import { appConfig } from "../../config/app.js";
import { APP_MODULES } from "../../models/v1/AppModule.js";
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

const fetchUserPermissions = async ({ userId }) => {
  try {
    const permissions = await Permission.aggregate([
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
        $unwind: "$appModules",
      },
      {
        $project: {
          moduleKey: "$appModules.key",
        },
      },
      {
        $group: {
          _id: null,
          moduleKeys: {
            $push: "$moduleKey",
          },
        },
      },
    ]);

    if (permissions.length && permissions[0].moduleKeys?.length) {
      const encryptedModules = encryptModules(permissions[0].moduleKeys);
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

    // Check if user already has permissions and update it
    const existingPermissions = await Permission.findOne({ userId: userId });
    if (existingPermissions) {
      const updatedUserPermissions = await Permission.findOneAndUpdate(
        { userId: userId },
        { $set: { modules: newPermissions.modules } },
        { new: true }
      );
      return updatedUserPermissions;
    }

    // Create new permissions
    const createdUserPermissions = await Permission.create(newPermissions);

    return createdUserPermissions;
  } catch (e) {
    throw new Error(e.message);
  }
};

export default {
  fetchAppModules,
  fetchUserPermissions,
  setUserPermissions,
};
