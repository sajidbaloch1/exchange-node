import {
  generatePaginationQueries,
  generateSearchFilters,
} from "../../lib/helpers/filters.js";
import SportsBetCategory from "../../models/v1/SportsBetCategory.js";

// Fetch all Sports-Bet-Category from the database
const fetchAllSportsBetCategory = async ({
  page,
  perPage,
  sortBy,
  direction,
  showDeleted,
  searchQuery,
}) => {
  try {
    const sortDirection = direction === "asc" ? 1 : -1;

    const paginationQueries = generatePaginationQueries(page, perPage);

    const filters = {
      isDeleted: showDeleted,
    };

    if (searchQuery) {
      const fields = ["sportsId", "betCatId"];
      filters.$or = generateSearchFilters(searchQuery, fields);
    }

    const sportsBetCategory = await SportsBetCategory.aggregate([
      {
        $match: filters,
      },
      {
        $lookup: {
          from: "bet_categories",
          localField: "betCatId",
          foreignField: "_id",
          as: "betCategory",
          pipeline: [
            {
              $project: { name: 1 },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$betCategory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "sports",
          localField: "sportsId",
          foreignField: "_id",
          as: "sport",
          pipeline: [
            {
              $project: { name: 1 },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$sport",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $set: {
          betCatName: "$betCategory.name",
          sportsName: "$sport.name",
        },
      },
      {
        $unset: ["betCategory", "sport"],
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

    if (sportsBetCategory?.length) {
      data.records = sportsBetCategory[0]?.paginatedResults || [];
      data.totalRecords = sportsBetCategory[0]?.totalRecords?.length
        ? sportsBetCategory[0]?.totalRecords[0].count
        : 0;
    }

    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Fetch Sports-Bet-Category by Id from the database
 */
const fetchSportsBetCategoryId = async (_id) => {
  try {
    const sportsBetCategory = await SportsBetCategory.findById(_id);

    if (!sportsBetCategory) {
      throw new Error("Sports-Bet-Category not found.");
    }

    return sportsBetCategory;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * create Sports-Bet-Category in the database
 */
const addSportsBetCategory = async ({ sportsId, betCatId, maxBet, minBet, notes, isActive }) => {
  try {
    const existingSportsBetCategory = await SportsBetCategory.findOne({
      sportsId: sportsId,
      betCatId: betCatId,
    });

    if (existingSportsBetCategory) {
      throw new Error("Bet-Category already exist for this sport!");
    }

    const newSportsBetCategoryObj = {
      sportsId,
      betCatId,
      maxBet,
      minBet,
      notes,
      isActive
    };
    const newSportsBetCategory = await SportsBetCategory.create(newSportsBetCategoryObj);

    return newSportsBetCategory;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * update Sports-Bet-Category in the database
 */
const modifySportsBetCategory = async ({ _id, sportsId, betCatId, maxBet, minBet, notes, isActive }) => {
  try {
    const sportsBetCategory = await SportsBetCategory.findById(_id);

    if (!sportsBetCategory) {
      throw new Error("Sports-Bet-Category not found.");
    }

    sportsBetCategory.sportsId = sportsId;
    sportsBetCategory.betCatId = betCatId;
    sportsBetCategory.maxBet = maxBet;
    sportsBetCategory.minBet = minBet;
    sportsBetCategory.notes = notes;
    sportsBetCategory.isActive = isActive;
    await sportsBetCategory.save();

    return sportsBetCategory;
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * delete Sports-Bet-Category in the database
 */
const removeSportsBetCategory = async (_id) => {
  try {
    const sportsBetCategory = await SportsBetCategory.findById(_id);

    if (!sportsBetCategory) {
      throw new Error("Sports-Bet-Category not found.");
    }

    await sportsBetCategory.softDelete();

    return sportsBetCategory;
  } catch (e) {
    throw new Error(e.message);
  }
};

export default {
  fetchAllSportsBetCategory,
  fetchSportsBetCategoryId,
  addSportsBetCategory,
  modifySportsBetCategory,
  removeSportsBetCategory,
};
