import mongoose from "mongoose";
import User from "../../models/v1/User.js";

const calculateUserSettlementPoint = async (userId) => {
  try {
    const userIdObject = new mongoose.Types.ObjectId(userId);

    const currentUser = await User.findById(userIdObject);

    if (!currentUser) {
      throw new Error("User not found.");
    }
    const parentUser = await User.findById(currentUser.parentId);

    if (!parentUser) {
      throw new Error("User not found.");
    }
    const result = await User.aggregate([
      {
        $match: { _id: userIdObject },
      },
      {
        $graphLookup: {
          from: "users",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentId",
          as: "descendants",
          maxDepth: 10,
        },
      },
      {
        $unwind: { path: "$descendants", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: "$_id",
          parentId: { $first: "$parentId" },
          creditPoints: { $first: "$creditPoints" },
          balance: { $first: "$balance" },
          totalPoint: { $sum: "$descendants.balance" },
          totalExposure: { $sum: "$descendants.exposure" },
        },
      },
      {
        $project: {
          _id: 0,
          balance: 1,
          creditPoints: 1,
          totalPoint: 1,
          totalExposure: 1,
          AllPts: { $sum: ["$balance", "$totalPoint"] },
        },
      },
      {
        $project: {
          balance: 1,
          creditPoints: 1,
          totalPoint: 1,
          totalExposure: 1,
          AllPts: 1,
          settlementPoint: { $subtract: ["$AllPts", "$creditPoints"] },
        },
      },
    ]);

    const settlementPoint = result[0].AllPts - result[0].creditPoints;
    const totalBalanceWithSettlement = parentUser.balance + settlementPoint;
    return totalBalanceWithSettlement;
  } catch (error) {
    console.error("Error:", error.message);
  }
};
const calculateAllUsersSettlementPoints = async (userId) => {
  try {
    const loggedInUser = await User.findById(userId);
    if (!loggedInUser) {
      throw new Error("User not found.");
    }
    const users = await User.find({ parentId: loggedInUser._id });
    const settlementPoints = [];

    for (const user of users) {
      const result = await User.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(loggedInUser) },
        },
        {
          $graphLookup: {
            from: "users",
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "parentId",
            as: "descendants",
            maxDepth: 10,
          },
        },
        {
          $unwind: { path: "$descendants", preserveNullAndEmptyArrays: true },
        },
        {
          $group: {
            _id: "$_id",
            parentId: { $first: "$parentId" },
            creditPoints: { $first: "$creditPoints" },
            balance: { $first: "$balance" },
            totalPoint: { $sum: "$descendants.balance" },
            totalExposure: { $sum: "$descendants.exposure" },
          },
        },
        {
          $project: {
            _id: 0,
            balance: 1,
            creditPoints: 1,
            totalPoint: 1,
            totalExposure: 1,
            AllPts: { $sum: ["$balance", "$totalPoint"] },
          },
        },
        {
          $project: {
            balance: 1,
            creditPoints: 1,
            totalPoint: 1,
            totalExposure: 1,
            AllPts: 1,
            settlementPoint: { $subtract: ["$AllPts", "$creditPoints"] },
          },
        },
      ]);

      if (result.length > 0) {
        // Check if result exists before accessing it
        const settlementPoint = result[0].settlementPoint;
        const totalBalanceWithSettlement = user.balance + settlementPoint;
        settlementPoints.push({ userId: user._id, settlementPoint, totalBalanceWithSettlement });
      }
    }

    return settlementPoints;
  } catch (error) {
    console.error("Error:", error.message);
    throw error; // Re-throw the error to propagate it
  }
};
export default {
  calculateUserSettlementPoint,
  calculateAllUsersSettlementPoints,
};
