import mongoose from "mongoose";
import ErrorResponse from "../lib/error-handling/error-response.js";
import {
  generatePaginationQueries,
  generateSearchFilters,
} from "../lib/helpers/filter-helpers.js";
import User, { USER_ACCESSIBLE_ROLES, USER_ROLE } from "../models/User.js";

// Fetch all users from the database
const fetchAllUsers = async ({ user, ...reqBody }) => {
  try {
    const { page, perPage, sortBy, direction, showDeleted, role, searchQuery } =
      reqBody;

    // Pagination and Sorting
    const sortDirection = direction === "asc" ? 1 : -1;
    const paginationQueries = generatePaginationQueries(page, perPage);

    // Filters
    const filters = {
      isDeleted: showDeleted,
    };

    if (role) {
      filters.role = role;
    }

    if (searchQuery) {
      const fields = ["username"];
      filters.$or = generateSearchFilters(searchQuery, fields);
    }

    const loggedInUser = await User.findById(user._id, { role: 1 });
    if (loggedInUser.role !== USER_ROLE.SYSTEM_OWNER) {
      filters.parentId = new mongoose.Types.ObjectId(user._id);
    }

    const users = await User.aggregate([
      {
        $match: filters,
      },
      {
        $lookup: {
          from: "users",
          localField: "parentId",
          foreignField: "_id",
          as: "parentUser",
          pipeline: [
            {
              $project: { username: 1 },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$parentUser",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unset: ["__v", "password"],
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

    if (users?.length) {
      data.records = users[0]?.paginatedResults || [];
      data.totalRecords = users[0]?.totalRecords?.length
        ? users[0]?.totalRecords[0].count
        : 0;
    }

    return data;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * Fetch user by Id from the database
 */
const fetchUserId = async (_id) => {
  try {
    return await User.findById(_id, { password: 0 });
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * Create user in the database
 */
const addUser = async ({ user, ...reqBody }) => {
  const { fullName, username, password, rate, balance, role, currencyId } =
    reqBody;

  try {
    const loggedInUser = await User.findById(user._id);

    const newUserObj = {
      fullName,
      username,
      password,
      role,
      currencyId: loggedInUser.currencyId,
      parentId: loggedInUser._id,
      forcePasswordChange: true,
    };

    if (rate) {
      newUserObj.rate = rate;
    }

    if (balance) {
      if (balance > loggedInUser.balance) {
        throw new Error("Given balance exceeds the available balance!");
      }
      newUserObj.creditPoints = balance;
      newUserObj.balance = balance;
    }

    if (loggedInUser.role === USER_ROLE.SYSTEM_OWNER) {
      if (!currencyId) {
        throw new Error("currencyId is required!");
      }
      newUserObj.currencyId = currencyId;
    }

    const newUser = await User.create(newUserObj);

    // Update logged in users balance and child status
    loggedInUser.balance = loggedInUser.balance - newUser.balance;
    loggedInUser.hasChild = true;

    await loggedInUser.save();

    return newUser;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * update user in the database
 */
const modifyUser = async ({ _id, rate, balance, password }) => {
  try {
    const user = await User.findById(_id);

    user.password = password;
    user.rate = rate;
    user.balance = balance;

    await user.save();

    return user;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * delete user in the database
 */
const removeUser = async (_id) => {
  try {
    const user = await User.findById(_id);

    await user.softDelete();

    return user;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

const statusModify = async ({ _id, isBetLock, isActive }) => {
  try {
    const user = await User.findById(_id);
    if (isBetLock) {
      user.isBetLock = isBetLock;
    }
    if (isActive) {
      user.isActive = isActive;
    }

    await user.save();

    return user;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

export default {
  fetchAllUsers,
  fetchUserId,
  addUser,
  modifyUser,
  removeUser,
  statusModify,
};
