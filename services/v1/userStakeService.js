import ErrorResponse from "../../lib/error-handling/error-response.js";
import { generatePaginationQueries, generateSearchFilters } from "../../lib/helpers/filters.js";
import Stake from "../../models/v1/UserStake.js";
import UserStake from "../../models/v1/UserStake.js";

// Fetch all stake from the database
const fetchAllStake = async ({ page, perPage, sortBy, direction, showDeleted, searchQuery }) => {
  try {
    const sortDirection = direction === "asc" ? 1 : -1;

    const paginationQueries = generatePaginationQueries(page, perPage);

    const filters = {
      isDeleted: showDeleted,
    };

    if (searchQuery) {
      const fields = ["name"];
      filters.$or = generateSearchFilters(searchQuery, fields);
    }

    const stake = await UserStake.aggregate([
      {
        $match: filters,
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

    for (var i = 0; i < stake[0].paginatedResults.length; i++) {
      const data = {
        records: [],
        totalRecords: 0,
      };

      if (stake?.length) {
        data.records = stake[0]?.paginatedResults || [];
        data.totalRecords = stake[0]?.totalRecords?.length ? stake[0]?.totalRecords[0].count : 0;
      }

      return data;
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Fetch Stake by Id from the database
 */
const fetchStakeId = async (_id) => {
  try {
    const stake = await UserStake.findById(_id);

    return stake;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * create Stake in the database
 */
const addStake = async ({ userId, inputValues }) => {
  try {
    const newStakeObj = {
      userId: userId,
      inputValues: inputValues,
    };
    const newstake = await UserStake.create(newStakeObj);

    return newstake;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * update Stake in the database
 */
const modifyStake = async ({ _id, inputValues }) => {
  try {
    if (!_id) {
      throw new Error("Missing _id in the request body.");
    }

    const stake = await UserStake.findById(_id);

    if (!stake) {
      throw new Error("Stake not found.");
    }

    stake.inputValues = inputValues;
    await stake.save();

    return stake;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};
export default {
  fetchAllStake,
  fetchStakeId,
  addStake,
  modifyStake,
};
