import { generatePaginationQueries, generateSearchFilters } from "../../lib/helpers/pipeline.js";
import BetCategory from "../../models/v1/BetCategory.js";

// Fetch all Bet-Category from the database
const fetchAllBetCategory = async ({ page, perPage, sortBy, direction, showDeleted, searchQuery }) => {
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

    const betCategory = await BetCategory.aggregate([
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

    const data = {
      records: [],
      totalRecords: 0,
    };

    if (betCategory?.length) {
      data.records = betCategory[0]?.paginatedResults || [];
      data.totalRecords = betCategory[0]?.totalRecords?.length ? betCategory[0]?.totalRecords[0].count : 0;
    }

    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Fetch Bet-Category by Id from the database
 */
const fetchBetCategoryId = async (_id) => {
  try {
    const betCategory = await BetCategory.findById(_id);

    if (!betCategory) {
      throw new Error("Bet-Category not found.");
    }

    return betCategory;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * create Bet-Category in the database
 */
const addBetCategory = async ({ name }) => {
  try {
    const existingBetCategory = await BetCategory.findOne({ name: name });

    if (existingBetCategory) {
      throw new Error("Name already exists!");
    }

    const newBetCategoryObj = {
      name: name,
    };
    const newBetCategory = await BetCategory.create(newBetCategoryObj);

    return newBetCategory;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * update Bet-Category in the database
 */
const modifyBetCategory = async ({ _id, name }) => {
  try {
    const betCategory = await BetCategory.findById(_id);

    if (!betCategory) {
      throw new Error("Bet-Category not found.");
    }

    betCategory.name = name;

    await betCategory.save();

    return betCategory;
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * delete Bet-Category in the database
 */
const removeBetCategory = async (_id) => {
  try {
    const betCategory = await BetCategory.findById(_id);

    if (!betCategory) {
      throw new Error("Bet-Category not found.");
    }

    await betCategory.softDelete();

    return betCategory;
  } catch (e) {
    throw new Error(e.message);
  }
};

export default {
  fetchAllBetCategory,
  fetchBetCategoryId,
  addBetCategory,
  modifyBetCategory,
  removeBetCategory,
};
