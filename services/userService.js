import {
  generatePaginationQueries,
  generateSearchFilters,
} from "../lib/filter-helper.js";
import User, { USER_ACCESSIBLE_ROLES, USER_ROLE } from "../models/User.js";

// Fetch all users from the database
const fetchAllUsers = async ({
  page,
  perPage,
  sortBy,
  direction,
  showDeleted,
  role,
  searchQuery,
}) => {
  try {
    const sortDirection = direction === "asc" ? 1 : -1;

    const paginationQueries = generatePaginationQueries(page, perPage);

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
    throw new Error(e.message);
  }
};

/**
 * Fetch user by Id from the database
 */
const fetchUserId = async (_id) => {
  try {
    const user = await User.findById(_id, { password: 0 });

    return user;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * create user in the database
 */
const addUser = async ({
  user,
  fullName,
  username,
  password,
  rate,
  balance,
  role,
  currencyId,
}) => {
  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      throw new Error("username already exists!");
    }

    const newUserObj = {
      fullName: fullName,
      username: username,
      password,
      forcePasswordChange: true,
    };
    if (currencyId) {
      newUserObj.currencyId = currencyId;
    }

    if (rate) {
      newUserObj.rate = rate;
    }

    if (balance) {
      newUserObj.balance = balance;
    }
    // Set Parent
    const loggedInUser = await User.findById(user._id);

    newUserObj.parentId = loggedInUser._id;

    if (loggedInUser.role !== USER_ROLE.SYSTEM_OWNER) {
      newUserObj.currencyId = loggedInUser.currencyId;
    }

    if (role) {
      const userAllowedRoles = USER_ACCESSIBLE_ROLES[loggedInUser.role];
      if (!userAllowedRoles.includes(role)) {
        throw new Error("Unauthorized!");
      }
      newUserObj.role = role;
    }

    const newUser = await User.create(newUserObj);

    return newUser;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * update user in the database
 */
const modifyUser = async ({ _id, rate, balance, status, password }) => {
  try {
    const user = await User.findById(_id);

    user.status = status;
    user.password = password;
    user.rate = rate;
    user.balance = balance;

    await user.save();

    return user;
  } catch (e) {
    throw new Error(e.message);
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
    throw new Error(e.message);
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
    throw new Error(e.message);
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
