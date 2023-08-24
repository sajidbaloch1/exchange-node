import mongoose from "mongoose";
import User from "../../models/v1/User.js";
// Fetch all Dashboard from the database
const fetchDashboardId = async (_id) => {
  try {
    const result = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(_id) },
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
          _id: null,
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
          upPoint: 1,
          downPoint: 1,
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
          upPoint: 1,
          downPoint: 1,
        },
      },
    ]);
    return {
      result,
    };
  } catch (e) {
    throw new Error(e);
  }
};
export default {
  fetchDashboardId,
};
