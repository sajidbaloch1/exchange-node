import Bet from "../../models/v1/Bet.js";
import mongoose from "mongoose";
import ErrorResponse from "../../lib/error-handling/error-response.js";
import { generatePaginationQueries, generateSearchFilters } from "../../lib/helpers/pipeline.js";
/**
 * create Bet in the database
 */
const addBet = async ({ ...reqBody }) => {
  try {
    const {
      userId,
      marketId,
      eventId,
      odds,
      stake,
      isBack,
      betOrderType,
      betOrderStatus,
      betResultStatus,
      betPl,
      deviceInfo,
      ipAddress,
    } = reqBody;

    const newBetObj = {
      userId,
      marketId,
      eventId,
      odds,
      stake,
      isBack,
      betOrderType,
      betOrderStatus,
      betResultStatus,
      betPl,
      deviceInfo,
      ipAddress,
    };
    const newBet = await Bet.create(newBetObj);

    return newBet;
  } catch (e) {
    throw new Error(e);
  }
};

// Fetch all bet from the database
const fetchAllBet = async ({ ...reqBody }) => {
  try {
    const {
      page,
      perPage,
      sortBy,
      direction,
      searchQuery,
      eventId,
      marketId,
      betType,
      username
    } = reqBody;

    // Pagination and Sorting
    const sortDirection = direction === "asc" ? 1 : -1;
    const paginationQueries = generatePaginationQueries(page, perPage);

    let filters = {};

    if (eventId) {
      filters.eventId = new mongoose.Types.ObjectId(eventId);
    }

    if (marketId) {
      filters.marketId = new mongoose.Types.ObjectId(marketId);
    }

    if (eventId && marketId) {
      delete filters.marketId;
    }

    if (betType) {
      if (betType == "back") {
        filters.isBack = true;
      }
      else if (betType == "lay") {
        filters.isBack = false;
      }
    }

    if (username) {
      filters['user.username'] = { "$regex": username, "$options": "i" }
    }

    if (searchQuery) {
      const fields = ["userId", "ipAddress"];
      filters.$or = generateSearchFilters(searchQuery, fields);
    }

    const bet = await Bet.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
          pipeline: [
            {
              $project: { name: 1 },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$event",
          preserveNullAndEmptyArrays: true,
        },
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
        $lookup: {
          from: "markets",
          localField: "marketId",
          foreignField: "_id",
          as: "market",
          pipeline: [
            {
              $project: { name: 1 },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$market",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: filters,
      },
      {
        $set: {
          eventName: "$event.name",
          userName: "$user.username",
          marketName: "$market.name",
        },
      },
      {
        $unset: ["event", "user", "market"],
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

    if (bet?.length) {
      data.records = bet[0]?.paginatedResults || [];
      data.totalRecords = bet[0]?.totalRecords?.length ? bet[0]?.totalRecords[0].count : 0;
    }
    return data;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

export default {
  addBet,
  fetchAllBet
};
