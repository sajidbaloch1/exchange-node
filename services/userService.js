import { encryptPassword } from "../lib/auth-helpers.js";
import { generatePaginationQueries } from "../lib/pagination-helper.js";
import User from "../models/User.js";

/**
 * Fetch all users from the database
 */
const fetchAllUsers = async ({ page, perPage, sortBy, direction }) => {
  try {
    const sortDirection = direction === "asc" ? 1 : -1;

    const paginationQueries = generatePaginationQueries(page, perPage);

    const users = await User.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $project: {
          username: 1,
          rate: 1,
          role: 1,
          balance: 1,
          exposureLimit: 1,
        },
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
const addUser = async ({ username, password, rate, role }) => {
  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      throw new Error("username already exists!");
    }

    const hashedPassword = await encryptPassword(password);

    const newUserObj = {
      username: username,
      password: hashedPassword,
      forcePasswordChange: true,
    };

    if (rate) {
      newUserObj.rate = rate;
    }

    if (role) {
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
const modifyUser = async (body) => {
  const user = await User.findByIdAndUpdate(body._id, body);
  return user;
};

/**
 * delete user in the database
 */
const removeUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  return user;
};

export default {
  fetchAllUsers,
  fetchUserId,
  addUser,
  modifyUser,
  removeUser,
};
