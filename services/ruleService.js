import {
  generatePaginationQueries,
  generateSearchFilters,
} from "../lib/helpers/filter.js";
import Rule from "../models/Rule.js";

// Fetch all Rule from the database
const fetchAllRule = async ({
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
            const fields = ["sportsId"];
            filters.$or = generateSearchFilters(searchQuery, fields);
        }

        const rule = await Rule.aggregate([
            {
                $match: filters,
            },
            {
                $lookup: {
                    from: "bet_categories",
                    localField: "betCatId",
                    foreignField: "_id",
                    as: "betCategory",
                    pipeline: [
                        {
                            $project: { name: 1 },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: "$betCategory",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "sports",
                    localField: "sportsId",
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
                    betCatName: "$betCategory.name",
                    sportsName: "$sport.name",
                }
            },
            {
                $unset: ["betCategory", "sport"],
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

        if (rule?.length) {
            data.records = rule[0]?.paginatedResults || [];
            data.totalRecords = rule[0]?.totalRecords?.length
                ? rule[0]?.totalRecords[0].count
                : 0;
        }

        return data;
    } catch (e) {
        throw new Error(e.message);
    }
};

/**
 * Fetch Rule by Id from the database
 */
const fetchRuleId = async (_id) => {
    try {
        const rule = await Rule.findById(_id);

        if (!rule) {
            throw new Error("Rule not found.");
        }

        return rule;
    } catch (e) {
        throw new Error(e);
    }
};

/**
 * create Rule in the database
 */
const addRule = async ({ gameType, casinoId, sportsId, betCatId, notes }) => {
    try {

        if (sportsId != null) {
            const existingSportsId = await Rule.findOne({ sportsId: sportsId, betCatId: betCatId });
            if (existingSportsId) {
                throw new Error("Bet-Category already exist for this sport!");
            }
        }

        const newRuleObj = {
            gameType,
            casinoId,
            sportsId,
            betCatId,
            notes
        };
        const newRule = await Rule.create(newRuleObj);

        return newRule;
    } catch (e) {
        throw new Error(e);
    }
};

/**
 * update Rule in the database
 */
const modifyRule = async ({ _id, gameType, casinoId, sportsId, betCatId, notes }) => {
    try {
        const rule = await Rule.findById(_id);

        if (!rule) {
            throw new Error("Rule not found.");
        }

        rule.gameType = gameType;
        rule.casinoId = casinoId;
        rule.sportsId = sportsId;
        rule.betCatId = betCatId;
        rule.notes = notes;
        await rule.save();

        return rule;
    } catch (e) {
        throw new Error(e.message);
    }
};


/**
 * delete Rule in the database
 */
const removeRule = async (_id) => {
    try {
        const rule = await Rule.findById(_id);

        if (!rule) {
            throw new Error("Rule not found.");
        }

        await rule.softDelete();

        return rule;
    } catch (e) {
        throw new Error(e.message);
    }
};


export default {
    fetchAllRule,
    fetchRuleId,
    addRule,
    modifyRule,
    removeRule
};