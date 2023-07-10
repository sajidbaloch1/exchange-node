import {
  generatePaginationQueries,
  generateSearchFilters,
} from "../lib/filter-helper.js";
import Sport from "../models/Sport.js";

// Fetch all sport from the database
const fetchAllSport = async ({
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
      const fields = ["name"];
      filters.$or = generateSearchFilters(searchQuery, fields);
    }

    const sports = await Sport.aggregate([
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

    if (sports?.length) {
      data.records = sports[0]?.paginatedResults || [];
      data.totalRecords = sports[0]?.totalRecords?.length
        ? sports[0]?.totalRecords[0].count
        : 0;
    }

    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Fetch Sport by Id from the database
 */
const fetchSportId = async (_id) => {
  try {
    const sport = await Sport.findById(_id);

    return sport;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * create Sport in the database
 */
const addSport = async ({ name }) => {
  try {
    const existingSport = await Sport.findOne({ name: name });
    if (existingSport) {
      throw new Error("name already exists!");
    }

    const newSportObj = {
      name: name,
    };
    const newsport = await Sport.create(newSportObj);

    return newsport;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * update Sport in the database
 */
const modifySport = async ({ _id, name }) => {
  try {
    const sport = await Sport.findById(_id);

    sport.name = name;

    await sport.save();

    return sport;
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * delete Sport in the database
 */
const removeSport = async (_id) => {
  try {
    const deletedSport = await Sport.findByIdAndDelete(_id);

    return deletedSport;
  } catch (e) {
    throw new Error(e.message);
  }
};

export default {
  fetchAllSport,
  fetchSportId,
  addSport,
  modifySport,
  removeSport,
};
