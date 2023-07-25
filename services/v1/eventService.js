import mongoose, { isValidObjectId } from "mongoose";
import ErrorResponse from "../../lib/error-handling/error-response.js";
import {
  generatePaginationQueries,
  generateSearchFilters,
} from "../../lib/helpers/filters.js";
import Event from "../../models/v1/Event.js";

// Fetch all event from the database
const fetchAllEvent = async ({ ...reqBody }) => {
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

    const event = await Event.aggregate([
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
        $lookup: {
          from: "competitions",
          localField: "competitionId",
          foreignField: "_id",
          as: "competition",
          pipeline: [
            {
              $project: { name: 1 },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$competition",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          sportsName: "$sport.name",
          competitionName: "$competition.name",
        },
      },
      {
        $unset: ["sport", "competition"],
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

    if (event?.length) {
      data.records = event[0]?.paginatedResults || [];
      data.totalRecords = event[0]?.totalRecords?.length
        ? event[0]?.totalRecords[0].count
        : 0;
    }

    return data;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * Fetch event by Id from the database
 */
const fetchEventId = async (_id) => {
  try {
    return await Event.findById(_id);
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * Create event in the database
 */
const addEvent = async ({ ...reqBody }) => {
  const {
    name,
    sportId,
    competitionId,
    matchDate,
    oddsLimit,
    volumeLimit,
    minStake,
    minStakeSession,
    maxStake,
    maxStakeSession,
  } = reqBody;

  try {
    const existingEvent = await Event.findOne({ name: name });

    if (existingEvent) {
      throw new Error("Event already exists!");
    }
    const newEventObj = {
      name,
      sportId,
      competitionId,
      matchDate,
      oddsLimit,
      volumeLimit,
      minStake,
      minStakeSession,
      maxStake,
      maxStakeSession,
      isActive: true,
      isManual: true,
    };

    const newEvent = await Event.create(newEventObj);

    return newEvent;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * update event in the database
 */
const modifyEvent = async ({ ...reqBody }) => {
  try {
    const event = await Event.findById(reqBody._id);

    if (!event) {
      throw new Error("Event not found.");
    }
    event.name = reqBody.name;
    event.sportId = reqBody.sportId;
    event.competitionId = reqBody.competitionId;
    event.oddsLimit = reqBody.oddsLimit;
    event.volumeLimit = reqBody.volumeLimit;
    event.matchDate = reqBody.matchDate;
    event.minStake = reqBody.minStake;
    event.minStakeSession = reqBody.minStakeSession;
    event.maxStake = reqBody.maxStake;
    event.maxStakeSession = reqBody.maxStakeSession;
    event.betDeleted = reqBody.betDeleted;
    event.hardBetDeleted = reqBody.hardBetDeleted;
    event.completed = reqBody.completed;
    event.isActive = reqBody.isActive;
    await event.save();

    return event;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * delete event in the database
 */
const removeEvent = async (_id) => {
  try {
    const event = await Event.findById(_id);

    await event.softDelete();

    return event;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

const eventStatusModify = async ({ _id, fieldName, status }) => {
  try {
    const event = await Event.findById(_id);

    event[fieldName] = status;
    await event.save();

    return event;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

export default {
  fetchAllEvent,
  fetchEventId,
  addEvent,
  modifyEvent,
  removeEvent,
  eventStatusModify,
};
