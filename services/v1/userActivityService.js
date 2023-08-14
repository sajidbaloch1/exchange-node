import UserActivity from "../../models/v1/UserActivity.js";
import ErrorResponse from "../../lib/error-handling/error-response.js";
import { generatePaginationQueries, generateSearchFilters } from "../../lib/helpers/pipeline.js";
import mongoose from "mongoose";

const createUserActivity = async ({
  userId,
  event,
  ipAddress,
  description,
  city,
  country,
  platform
}) => {
  try {
    const userActivity = new UserActivity({
      userId,
      event,
      ipAddress,
      description,
      city,
      country,
      platform
    });
    await userActivity.save();
    return userActivity;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch all users activity from the database
const fetchAllUserActivity = async ({ user, ...reqBody }) => {
  try {
    const {
      page,
      perPage,
      sortBy,
      direction,
      searchQuery,
      type,
      userId
    } = reqBody;

    // Pagination and Sorting
    const sortDirection = direction === "asc" ? 1 : -1;

    const paginationQueries = generatePaginationQueries(page, perPage);

    let fromDate, toDate;
    if (reqBody.fromDate && reqBody.toDate) {
      fromDate = new Date(new Date(reqBody.fromDate).setUTCHours(0, 0, 0)).toISOString();
      toDate = new Date(new Date(reqBody.toDate).setUTCHours(23, 59, 59)).toISOString();
    }
    // Filters

    let filters = {};

    if (type) {
      filters = {
        event: type,
      }
    }
    if (fromDate && toDate) {
      filters = {
        createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
        userId: new mongoose.Types.ObjectId(user._id),
      };
    }

    if (userId) {
      filters.userId = new mongoose.Types.ObjectId(userId);
    }

    if (searchQuery) {
      const fields = ["userId"];
      filters.$or = generateSearchFilters(searchQuery, fields);
    }

    const userActivity = await UserActivity.aggregate([
      {
        $match: filters,
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: { username: 1 },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          username: "$user.username",
        },
      },
      {
        $unset: ["geoLocation", "user", "__v"],
      },
      {
        $facet: {
          totalRecords: [{ $count: "count" }],
          paginatedResults: [
            {
              $sort: { [sortBy]: sortDirection },
            },
            ...paginationQueries,
          ],
        },
      },
    ]);

    const data = {
      records: [],
      totalRecords: 0,
    };

    if (userActivity?.length) {
      data.records = userActivity[0]?.paginatedResults || [];
      data.totalRecords = userActivity[0]?.totalRecords?.length ? userActivity[0]?.totalRecords[0].count : 0;
    }

    return data;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

export default { createUserActivity, fetchAllUserActivity };
