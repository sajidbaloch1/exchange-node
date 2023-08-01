import User from "../../models/v1/User.js";
// Fetch all Dashboard from the database
const fetchDashboardId = async (_id) => {
  try {
    const dashboard = await User.findById(_id).select("balance creditPoints");

    if (!dashboard) {
      throw new Error("User not found");
    }

    const db = User.db;
    console.log(db);
    const aggregationQuery = [
      // {
      //   $match: { $expr: { $eq: ["$_id", _id] } },
      // },

      {
        $graphLookup: {
          from: "users",
          startWith: "$_id",
          connectFromField: "parentId",
          connectToField: "_id",
          as: "descendants",
          maxDepth: 10,
        },
      },
      {
        $group: {
          _id: null,
          totalExposer: { $sum: "$descendants.exposer" },
        },
      },
      {
        $project: {
          _id: 0,
          balance: 1,
          totalExposer: 1,
        },
      },
    ];
    console.log(aggregationQuery);
    const exposure = await db.collection("users").aggregate(aggregationQuery).toArray();
    return {
      balance: dashboard.balance,
      creditPoints: dashboard.creditPoints,
      exposure,
    };
  } catch (e) {
    throw new Error(e);
  }
};
export default {
  fetchDashboardId,
};
