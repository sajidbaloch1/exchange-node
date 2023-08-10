import mongoose from "mongoose";
import ErrorResponse from "../../lib/error-handling/error-response.js";
import { generatePaginationQueries, generateSearchFilters } from "../../lib/helpers/filters.js";
import TransferRequest from "../../models/v1/TransferRequest.js";

// Fetch all TransferRequest from the database
const fetchAllTransferRequest = async ({ ...reqBody }) => {
  try {
    const {
      page,
      perPage,
      sortBy,
      direction,
      searchQuery,
      showDeleted,
      userId
    } = reqBody;

    // Pagination and Sorting
    const sortDirection = direction === "asc" ? 1 : -1;
    const paginationQueries = generatePaginationQueries(page, perPage);

    // Filters

    let filters = {
      isDeleted: showDeleted,
    };

    if (userId) {
      filters.userId = new mongoose.Types.ObjectId(userId);
    }
    if (searchQuery) {
      const fields = ["userId", "type"];
      filters.$or = generateSearchFilters(searchQuery, fields);
    }

    const TransferRequests = await TransferRequest.aggregate([
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

    if (TransferRequests?.length) {
      data.records = TransferRequests[0]?.paginatedResults || [];
      data.totalRecords = TransferRequests[0]?.totalRecords?.length ? TransferRequests[0]?.totalRecords[0].count : 0;
    }

    return data;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * Fetch TransferRequest by Id from the database
 */
const fetchTransferRequestId = async (_id) => {
  try {
    return await TransferRequest.findById(_id);
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * Create TransferRequest in the database
 */
const addTransferRequest = async ({ ...reqBody }) => {
  const {
    userId,
    transferTypeId,
    withdrawGroupId,
    amount,
  } = reqBody;

  try {
    const newTransferRequestObj = {
      userId,
      transferTypeId,
      withdrawGroupId,
      amount,
    };

    const newTransferRequest = await TransferRequest.create(newTransferRequestObj);

    return newTransferRequest;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * update TransferRequest in the database
 */
const modifyTransferRequest = async ({ ...reqBody }) => {
  try {
    const TransferRequests = await TransferRequest.findById(reqBody._id);

    if (!TransferRequests) {
      throw new Error("TransferRequest not found.");
    }

    TransferRequests.userId = reqBody.userId;
    TransferRequests.transferTypeId = reqBody.transferTypeId;
    TransferRequests.withdrawGroupId = reqBody.withdrawGroupId;
    TransferRequests.amount = reqBody.amount;
    TransferRequests.status = reqBody.status;
    TransferRequests.message = reqBody.message;

    await TransferRequests.save();

    return TransferRequests;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * delete TransferRequest in the database
 */
const removeTransferRequest = async (_id) => {
  try {
    const TransferRequests = await TransferRequest.findById(_id);

    await TransferRequests.softDelete();

    return TransferRequests;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * Withdraw Group status modify
 */
const transferRequestStatusModify = async ({ _id, fieldName, status }) => {
  try {
    const TransferRequests = await TransferRequest.findById(_id);

    TransferRequests[fieldName] = status;
    await TransferRequests.save();

    return TransferRequests;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

export default {
  fetchAllTransferRequest,
  fetchTransferRequestId,
  addTransferRequest,
  modifyTransferRequest,
  removeTransferRequest,
  transferRequestStatusModify,
};
