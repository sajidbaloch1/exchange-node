import mongoose, { isValidObjectId } from "mongoose";
import ErrorResponse from "../../lib/error-handling/error-response.js";
import { encryptPassword } from "../../lib/helpers/auth.js";
import {
  generatePaginationQueries,
  generateSearchFilters,
} from "../../lib/helpers/filters.js";
import Competition from "../../models/v1/Competition.js";

// Fetch all competition from the database
const fetchAllCompetition = async ({ ...reqBody }) => {
  try {
    const {
      page,
      perPage,
      sortBy,
      direction,
      searchQuery,
      showDeleted,
      showRecord,
    } = reqBody;

    // Pagination and Sorting
    const sortDirection = direction === "asc" ? 1 : -1;

    const paginationQueries = generatePaginationQueries(page, perPage);

    // Filters
    let filters = {};
    if (showRecord == "All") {
      filters = {
        isDeleted: showDeleted,
      };
    } else {
      filters = {
        isDeleted: showDeleted,
        isManual: true,
      };
    }

    if (searchQuery) {
      const fields = ["name", "sportId"];
      filters.$or = generateSearchFilters(searchQuery, fields);
    }

    const competition = await Competition.aggregate([
      {
        $match: filters,
      },
      {
        $lookup: {
          from: "sports",
          localField: "sportId",
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
          sportsName: "$sport.name",
        },
      },
      {
        $unset: ["sport"],
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

    if (competition?.length) {
      data.records = competition[0]?.paginatedResults || [];
      data.totalRecords = competition[0]?.totalRecords?.length
        ? competition[0]?.totalRecords[0].count
        : 0;
    }

    return data;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * Fetch compettition by Id from the database
 */
const fetchCompetitionId = async (_id) => {
  try {
    return await Competition.findById(_id);
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * Create competition in the database
 */
const addCometition = async ({ ...reqBody }) => {
  const { name, sportId } = reqBody;

  try {
    const existingCompetition = await Competition.findOne({ name: name });

    if (existingCompetition) {
      throw new Error("Competition already exists!");
    }
    const newCompetitionObj = {
      name,
      sportId,
      createdOn: new Date(),
      isActive: true,
      isManual: true,
    };

    const newCompetition = await Competition.create(newCompetitionObj);

    return newCompetition;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * update competition in the database
 */
const modifyCompetition = async ({ ...reqBody }) => {
  try {
    const competition = await Competition.findById(reqBody._id);

    if (!competition) {
      throw new Error("Competition not found.");
    }
    competition.name = reqBody.name;
    competition.sportId = reqBody.sportId;
    await competition.save();

    return competition;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * delete competition in the database
 */
const removeCompetition = async (_id) => {
  try {
    const competition = await Competition.findById(_id);

    await competition.softDelete();

    return competition;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};
const competitionStatusModify = async ({ _id, fieldName, status }) => {
  try {
    const competition = await Competition.findById(_id);

    competition[fieldName] = status;
    await competition.save();

    return competition;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

export default {
  fetchAllCompetition,
  fetchCompetitionId,
  addCometition,
  modifyCompetition,
  removeCompetition,
  competitionStatusModify,
};
