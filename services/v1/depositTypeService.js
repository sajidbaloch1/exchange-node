import mongoose from "mongoose";
import ErrorResponse from "../../lib/error-handling/error-response.js";
import { generatePaginationQueries, generateSearchFilters } from "../../lib/helpers/filters.js";
import DepositType from "../../models/v1/DepositType.js";

// Fetch all DepositType from the database
const fetchAllDepositType = async ({ ...reqBody }) => {
  try {
    const {
      page,
      perPage,
      sortBy,
      direction,
      searchQuery,
      showDeleted,
    } = reqBody;

    // Pagination and Sorting
    const sortDirection = direction === "asc" ? 1 : -1;
    const paginationQueries = generatePaginationQueries(page, perPage);

    // Filters

    let filters = {
      isDeleted: showDeleted,
    };


    if (searchQuery) {
      const fields = ["userId", "type"];
      filters.$or = generateSearchFilters(searchQuery, fields);
    }

    const DepositTypes = await DepositType.aggregate([
      {
        $match: filters,
      },
      {
        $facet: {
          totalRecords: [{ $count: "count" }],
          paginatedResults: [
            ...paginationQueries,
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

    if (DepositTypes?.length) {
      data.records = DepositTypes[0]?.paginatedResults || [];
      data.totalRecords = DepositTypes[0]?.totalRecords?.length ? DepositTypes[0]?.totalRecords[0].count : 0;
    }

    return data;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * Fetch DepositType by Id from the database
 */
const fetchDepositTypeId = async (_id) => {
  try {
    return await DepositType.findById(_id);
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * Create DepositType in the database
 */
const addDepositType = async ({ ...reqBody }) => {
  const {
    userId,
    type,
    name,
    minAmount,
    maxAmount,
    description,
    mobileNumber,
    accountHolderName,
    bankName,
    accountNumber,
    accountType,
    ifsc,
    platformName,
    platformDisplayName,
    platformAddress,
    depositLink
  } = reqBody;

  try {
    const newDepositTypeObj = {
      userId,
      type,
      name,
      minAmount,
      maxAmount,
      description,
      mobileNumber,
      accountHolderName,
      bankName,
      accountNumber,
      accountType,
      ifsc,
      platformName,
      platformDisplayName,
      platformAddress,
      depositLink
    };

    const newDepositType = await DepositType.create(newDepositTypeObj);

    return newDepositType;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * update DepositType in the database
 */
const modifyDepositType = async ({ ...reqBody }) => {
  try {
    const DepositTypes = await DepositType.findById(reqBody._id);

    if (!DepositTypes) {
      throw new Error("DepositType not found.");
    }

    DepositTypes.userId = reqBody.userId;
    DepositTypes.type = reqBody.type;
    DepositTypes.name = reqBody.name;
    DepositTypes.minAmount = reqBody.minAmount;
    DepositTypes.maxAmount = reqBody.maxAmount;
    DepositTypes.description = reqBody.description;
    DepositTypes.mobileNumber = reqBody.mobileNumber;
    DepositTypes.accountHolderName = reqBody.accountHolderName;
    DepositTypes.bankName = reqBody.bankName;
    DepositTypes.accountNumber = reqBody.accountNumber;
    DepositTypes.accountType = reqBody.accountType;
    DepositTypes.ifsc = reqBody.ifsc;
    DepositTypes.platformName = reqBody.platformName;
    DepositTypes.platformDisplayName = reqBody.platformDisplayName;
    DepositTypes.platformAddress = reqBody.platformAddress;
    DepositTypes.depositLink = reqBody.depositLink;
    DepositTypes.isActive = reqBody.isActive;

    await DepositTypes.save();

    return DepositTypes;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * delete DepositType in the database
 */
const removeDepositType = async (_id) => {
  try {
    const DepositTypes = await DepositType.findById(_id);

    await DepositTypes.softDelete();

    return DepositTypes;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * Withdraw Group status modify
 */
const depositTypeStatusModify = async ({ _id, fieldName, status }) => {
  try {
    const DepositTypes = await DepositType.findById(_id);

    DepositTypes[fieldName] = status;
    await DepositTypes.save();

    return DepositTypes;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

export default {
  fetchAllDepositType,
  fetchDepositTypeId,
  addDepositType,
  modifyDepositType,
  removeDepositType,
  depositTypeStatusModify,
};
