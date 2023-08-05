import mongoose from "mongoose";
import User from "../../models/v1/User.js";

const fetchDashboardId = async (_id) => {
  try {
    const result = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(_id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "parentId",
          as: "descendants",
        },
      },
      {
        $unwind: {
          path: "$descendants",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: null,
          creditPoints: { $first: "$creditPoints" },
          balance: { $first: "$balance" },
          totalPoint: { $sum: { $ifNull: ["$descendants.balance", 0] } },
          totalExposure: { $sum: { $ifNull: ["$descendants.exposure", 0] } },
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
          upperPoint: { $literal: 0 },
          downPoint: { $literal: 0 },
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
          upperPoint: 1,
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
