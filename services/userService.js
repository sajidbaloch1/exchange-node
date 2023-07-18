import mongoose, { isValidObjectId } from "mongoose";
import ErrorResponse from "../lib/error-handling/error-response.js";
import {
  generatePaginationQueries,
  generateSearchFilters,
} from "../lib/helpers/filters.js";
import AppModule from "../models/v1/AppModule.js";
import User, { USER_ACCESSIBLE_ROLES, USER_ROLE } from "../models/v1/User.js";
import { validateTransactionCode } from "../lib/helpers/transaction-code.js";
import permissionService from "./permissionService.js";

// Fetch all users from the database
const fetchAllUsers = async ({ user, ...reqBody }) => {
  try {
    const {
      page,
      perPage,
      sortBy,
      direction,
      showDeleted,
      role,
      searchQuery,
      parentId,
    } = reqBody;

    // Pagination and Sorting
    const sortDirection = direction === "asc" ? 1 : -1;

    const paginationQueries = generatePaginationQueries(page, perPage);

    // Filters
    const filters = {
      isDeleted: showDeleted,
      role: { $ne: USER_ROLE.SYSTEM_OWNER },
    };

    if (role && role != USER_ROLE.SYSTEM_OWNER) {
      filters.role = role;
    }

    if (parentId) {
      filters.parentId = new mongoose.Types.ObjectId(parentId);
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
  const {
    fullName,
    username,
    password,
    rate,
    creditPoints,
    role,
    currencyId,
    mobileNumber,
    city,
  } = reqBody;

  try {
    const loggedInUser = await User.findById(user._id);

    const newUserObj = {
      fullName,
      username,
      password,
      role,
      city,
      mobileNumber,
      currencyId: loggedInUser.currencyId,
      parentId: loggedInUser._id,
      forcePasswordChange: true,
    };

    if (currencyId) {
      newUserObj.currencyId = currencyId;
    }

    if (rate) {
      newUserObj.rate = rate;
    }

    if (creditPoints) {
      if (creditPoints > loggedInUser.balance) {
        throw new Error("Given credit points exceed the available balance!");
      }
      newUserObj.creditPoints = creditPoints;
      newUserObj.balance = creditPoints;
    }

    if (loggedInUser.role === USER_ROLE.SYSTEM_OWNER) {
      if (!currencyId) {
        throw new Error("currencyId is required!");
      }
      newUserObj.currencyId = currencyId;
    }

    const newUser = await User.create(newUserObj);

    // Update logged in users balance and child status
    loggedInUser.balance = loggedInUser.balance - creditPoints;
    loggedInUser.hasChild = true;

    await loggedInUser.save();

    return newUser;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

const calculateUserPointBalance = async (currentUser, userReq) => {
  try {
    const parentUser = await User.findById(currentUser.parentId);

    let userNewCreditPoints = currentUser.creditPoints;
    let userNewBalance = currentUser.balance;
    const currentUserBalanceInUse =
      currentUser.creditPoints - currentUser.balance;

    let parentNewBalance = parentUser.balance;

    const pointDiff = userReq.creditPoints - currentUser.creditPoints;

    // If points reduced
    if (pointDiff < 0) {
      if (currentUser.balance < Math.abs(pointDiff)) {
        throw new Error("Balance already in use!");
      }
      parentNewBalance = parentUser.balance + Math.abs(pointDiff);
      // If no change in points
    } else if (pointDiff === 0) {
      userNewCreditPoints = currentUser.creditPoints;
      userNewBalance = currentUser.balance;
      parentNewBalance = parentUser.balance;
      // If points increased
    } else if (pointDiff > 0) {
      if (parentUser.balance < pointDiff) {
        throw new Error("Insufficient balance!");
      }
      parentNewBalance = parentUser.balance - pointDiff;
    }

    userNewCreditPoints = currentUser.creditPoints + pointDiff;
    userNewBalance = userNewCreditPoints - currentUserBalanceInUse;

    return {
      creditPoints: userNewCreditPoints,
      balance: userNewBalance,
      parentBalance: parentNewBalance,
    };
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * update user in the database
 */
const modifyUser = async ({ user, ...reqBody }) => {
  try {
    const currentUser = await User.findById(reqBody._id);
    if (currentUser.role === USER_ROLE.SYSTEM_OWNER) {
      throw new Error("Failed to update user!");
    }

    const loggedInUser = await User.findById(user._id);

    // Logged in user should have access to the current user's role
    // Logged in user should be direct parent or System Owner
    if (
      !(
        USER_ACCESSIBLE_ROLES[loggedInUser.role].includes(currentUser.role) &&
        (currentUser.parentId.toString() === loggedInUser._id.toString() ||
          loggedInUser.role === USER_ROLE.SYSTEM_OWNER)
      )
    ) {
      throw new Error("Failed to update user!");
    }

    const { creditPoints, balance, parentBalance } =
      await calculateUserPointBalance(currentUser, reqBody);

    reqBody.creditPoints = creditPoints;
    reqBody.balance = balance;

    const updatedUser = await User.findByIdAndUpdate(currentUser._id, reqBody, {
      new: true,
    });

    await User.findOneAndUpdate(updatedUser.parentId, {
      balance: parentBalance,
    });

    return updatedUser;
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

/**
 * fetch balance
 */
const fetchBalance = async ({ user, ...reqBody }) => {
  try {
    const { userId } = reqBody;
    const user = await User.findOne(
      { _id: userId, role: { $ne: USER_ROLE.SYSTEM_OWNER } },
      { balance: 1, _id: 0 }
    );
    if (user) {
      return user;
    } else {
      throw new Error("User Not Found!");
    }
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

const cloneUser = async ({ user, ...reqBody }) => {
  try {
    const { fullName, username, password, moduleIds, transactionCode } =
      reqBody;

    // Validate module ids
    const validModuleIds = [];
    for (const id of moduleIds) {
      if (!isValidObjectId(id)) {
        continue;
      }
      const module = await AppModule.findById(id);
      if (module) {
        validModuleIds.push(id);
      }
    }

    // Validate parent
    const cloneParent = await User.findById(user._id).lean();
    if (!cloneParent || cloneParent.role === USER_ROLE.SYSTEM_OWNER) {
      throw new Error("Unauthorised request!");
    }
    const isValidCode = validateTransactionCode(
      transactionCode,
      cloneParent?.transactionCode
    );
    if (!isValidCode) {
      throw new Error("Invalid transactionCode!");
    }

    // Create user
    const newUserObj = {
      ...cloneParent,
      cloneParentId: cloneParent._id,
      fullName,
      username,
      password,
    };

    delete newUserObj._id;
    delete newUserObj.transactionCode;
    delete newUserObj.mobileNumber;

    const clonedUser = await User.create(newUserObj);

    // Create permissions
    await permissionService.setUserPermissions({
      userId: clonedUser._id,
      moduleIds,
    });

    return clonedUser;
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
  fetchBalance,
};
