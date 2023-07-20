import ErrorResponse from "../../lib/error-handling/error-response.js";
import {
  generatePaginationQueries,
  generateSearchFilters,
} from "../../lib/helpers/filters.js";
import Sport from "../../models/v1/Sport.js";
import SportsBetCategory from "../../models/v1/SportsBetCategory.js";

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

    const sport = await Sport.aggregate([
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

    for (var i = 0; i < sport[0].paginatedResults.length; i++) {
      const betCategoryCount = await SportsBetCategory.count({ sportsId: sport[0].paginatedResults[i]._id, isActive: true, isDeleted: false });
      sport[0].paginatedResults[i].betCategoryCount = betCategoryCount
    }

    const data = {
      records: [],
      totalRecords: 0,
    };

    if (sport?.length) {
      data.records = sport[0]?.paginatedResults || [];
      data.totalRecords = sport[0]?.totalRecords?.length
        ? sport[0]?.totalRecords[0].count
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
    const sportBetCategory = await SportsBetCategory.find({ sportsId: _id, isActive: true, isDeleted: false });
    const betCatId = [];
    sportBetCategory.forEach(element => {
      betCatId.push(element.betCatId)
    });
    const data = {
      _id: sport._id,
      name: sport.name,
      isActive: sport.isActive,
      updatedAt: sport.updatedAt,
      createdAt: sport.createdAt,
      betCategory: betCatId
    }
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * create Sport in the database
 */
const addSport = async ({ name, betCategory }) => {
  try {
    const existingSport = await Sport.findOne({ name: name });
    if (existingSport) {
      throw new Error("name already exists!");
    }

    const newSportObj = {
      name: name.toLowerCase().replace(/(?:^|\s)\S/g, function (char) {
        return char.toUpperCase();
      }),
    };
    const newsport = await Sport.create(newSportObj);

    const body = [];
    for (var i = 0; i < betCategory.length; i++) {
      body.push({
        sportsId: newsport._id,
        betCatId: betCategory[i]
      });
    }

    const newSportBetCategory = await SportsBetCategory.insertMany(body);

    return newsport;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * update Sport in the database
 */
const modifySport = async ({ _id, name, betCategory }) => {
  try {
    const sport = await Sport.findById(_id);
    const sportBetCategory = await SportsBetCategory.find({ sportsId: _id, isActive: true, isDeleted: false }, { betCatId: 1, _id: 0 });

    sport.name = name.toLowerCase().replace(/(?:^|\s)\S/g, function (char) {
      return char.toUpperCase();
    });
    await sport.save();

    var newCategoryAdd = betCategory.filter(function (obj) {
      return !sportBetCategory.some(function (obj2) {
        return obj == obj2.betCatId.toString();
      });
    });

    var oldCategoryRemove = sportBetCategory.filter(function (obj) {
      return !betCategory.some(function (obj2) {
        return obj.betCatId.toString() == obj2;
      });
    });

    for (var i = 0; i < newCategoryAdd.length; i++) {
      const findSportBetCategory = await SportsBetCategory.findOne({ sportsId: _id, betCatId: newCategoryAdd[i], isDeleted: false });

      if (findSportBetCategory) {
        findSportBetCategory.isActive = true;
        findSportBetCategory.save();
      }
      else {

        const newEntryCategory = {
          sportsId: _id,
          betCatId: newCategoryAdd[i]
        };
        const newSportBetCategory = await SportsBetCategory.create(newEntryCategory);
      }
    }

    for (var j = 0; j < oldCategoryRemove.length; j++) {
      const sportBetCategory = await SportsBetCategory.findOne({ sportsId: _id, betCatId: oldCategoryRemove[j].betCatId.toString() });
      sportBetCategory.isActive = false;
      await sportBetCategory.save();
    }

    return sport;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * delete Sport in the database
 */
const removeSport = async (_id) => {
  try {
    const sport = await Sport.findById(_id);

    await sport.softDelete();

    return sport;
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
