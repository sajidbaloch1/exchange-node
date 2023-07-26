import Transaction from "../../models/v1/Transaction.js";
import { generatePaginationQueries, generateSearchFilters } from "../../lib/helpers/filters.js";
import mongoose from "mongoose";
import ErrorResponse from "../../lib/error-handling/error-response.js";

// Create transaction in database
const createTransaction = async ({
    points,
    balancePoints,
    type,
    remark,
    userId,
    fromId,
    fromtoName
}) => {
    try {
        const userTransaction = new Transaction({
            points,
            balancePoints,
            type,
            remark,
            userId,
            fromId,
            fromtoName
        });
        await userTransaction.save();
        return userTransaction;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Fetch all transaction from the database
const fetchAllTransaction = async ({ ...reqBody }) => {
    try {
        const {
            page,
            perPage,
            sortBy,
            direction,
            searchQuery,
            userId
        } = reqBody;

        // Pagination and Sorting
        const sortDirection = direction === "asc" ? 1 : -1;

        const paginationQueries = generatePaginationQueries(page, perPage);

        let fromDate, toDate;
        if (reqBody.fromDate && reqBody.toDate) {
            fromDate = new Date(new Date(reqBody.fromDate).setUTCHours(0, 0, 0)).toISOString();
            toDate = new Date(new Date(reqBody.toDate).setUTCHours(23, 59, 59)).toISOString();
        }
        // Filters
        let filters = {};

        if (fromDate && toDate) {
            filters = {
                createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
                userId: new mongoose.Types.ObjectId(userId)
            }
        }
        else {
            filters = {
                userId: new mongoose.Types.ObjectId(userId)
            }
        }

        if (searchQuery) {
            const fields = ["fromtoName"];
            filters.$or = generateSearchFilters(searchQuery, fields);
        }

        const transaction = await Transaction.aggregate([
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

        if (transaction?.length) {
            data.records = transaction[0]?.paginatedResults || [];
            data.totalRecords = transaction[0]?.totalRecords?.length
                ? transaction[0]?.totalRecords[0].count
                : 0;
        }

        return data;
    } catch (e) {
        throw new ErrorResponse(e.message).status(200);
    }
};


export default { createTransaction, fetchAllTransaction };
