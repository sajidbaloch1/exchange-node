import mongoose from "mongoose";
import ErrorResponse from "../../lib/error-handling/error-response.js";
import { generatePaginationQueries, generateSearchFilters } from "../../lib/helpers/pipeline.js";
import Bet, { BET_ORDER_STATUS, BET_RESULT_STATUS } from "../../models/v1/Bet.js";
import Market from "../../models/v1/Market.js";
import User, { USER_ROLE } from "../../models/v1/User.js";

/**
 * create Bet in the database
 */
const addBet = async ({ user, ...reqBody }) => {
  try {
    const newBetObj = {
      userId: user._id,
      marketId: reqBody.marketId,
      eventId: reqBody.eventId,
      odds: reqBody.odds,
      stake: reqBody.stake,
      isBack: reqBody.isBack,
      betOrderType: reqBody.betOrderType,
      betOrderStatus: BET_ORDER_STATUS.PLACED,
      betResultStatus: BET_RESULT_STATUS.RUNNING,
      deviceInfo: reqBody.deviceInfo,
      ipAddress: reqBody.ipAddress,
      runnerId: reqBody.runnerId,
    };

    const newBet = await Bet.create(newBetObj);

    return newBet;
  } catch (e) {
    throw new Error(e);
  }
};

// Fetch all bet from the database
const fetchAllBet = async ({ ...reqBody }) => {
  try {
    const { page, perPage, sortBy, direction, searchQuery, eventId, marketId, betType, username } = reqBody;

    // Pagination and Sorting
    const sortDirection = direction === "asc" ? 1 : -1;
    const paginationQueries = generatePaginationQueries(page, perPage);

    let filters = {};

    if (eventId) {
      filters.eventId = new mongoose.Types.ObjectId(eventId);
    }

    if (marketId) {
      filters.marketId = new mongoose.Types.ObjectId(marketId);
    }

    if (eventId && marketId) {
      delete filters.marketId;
    }

    if (betType) {
      if (betType == "back") {
        filters.isBack = true;
      } else if (betType == "lay") {
        filters.isBack = false;
      }
    }

    if (username) {
      filters["user.username"] = { $regex: username, $options: "i" };
    }

    if (searchQuery) {
      const fields = ["userId", "ipAddress"];
      filters.$or = generateSearchFilters(searchQuery, fields);
    }

    const bet = await Bet.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      {
        $unwind: { path: "$event", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
          pipeline: [{ $project: { username: 1 } }],
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "market_runners",
          localField: "runnerId",
          foreignField: "_id",
          as: "marketRunner",
          pipeline: [{ $project: { runnerName: 1 } }],
        },
      },
      { $unwind: "$marketRunner" },
      {
        $lookup: {
          from: "markets",
          localField: "marketId",
          foreignField: "_id",
          as: "market",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      {
        $unwind: {
          path: "$market",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: filters,
      },
      {
        $set: {
          eventName: "$event.name",
          userName: "$user.username",
          marketName: "$market.name",
          runnerName: "$marketRunner.runnerName",
        },
      },
      {
        $unset: ["event", "user", "market", "marketRunner"],
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

    if (bet?.length) {
      data.records = bet[0]?.paginatedResults || [];
      data.totalRecords = bet[0]?.totalRecords?.length ? bet[0]?.totalRecords[0].count : 0;
    }
    return data;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

async function updateUserPl(userId, profitLoss) {
  let findUser = await User.findOne({ _id: userId });
  findUser.userPl = findUser.userPl + profitLoss;
  findUser.save();

  if (findUser.role != USER_ROLE.SUPER_ADMIN) {
    await updateUserPl(findUser.parentId, profitLoss);
  } else {
    return;
  }
}

const fetchUserEventBets = async ({ ...reqBody }) => {
  try {
    const { eventId, userId } = reqBody;

    const eventBets = await Bet.aggregate([
      {
        $match: {
          eventId: new mongoose.Types.ObjectId(eventId),
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "market_runners",
          localField: "runnerId",
          foreignField: "_id",
          as: "marketRunner",
          pipeline: [{ $project: { runnerName: 1 } }],
        },
      },
      { $unwind: "$marketRunner" },
      {
        $lookup: {
          from: "markets",
          localField: "marketId",
          foreignField: "_id",
          as: "market",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      {
        $unwind: "$market",
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$market",
          bets: {
            $push: {
              _id: "$_id",
              runner: "$marketRunner.runnerName",
              stake: "$stake",
              odds: "$odds",
              isBack: "$isBack",
              createdAt: "$createdAt",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          market: "$_id",
          bets: 1,
        },
      },
    ]);

    return eventBets;
  } catch (e) {
    throw new Error(e);
  }
};

const completeBet = async ({ ...reqBody }) => {
  try {
    const { marketId, winRunnerId } = reqBody;

    let findMarket = await Market.findOne({ _id: marketId });
    if (
      findMarket.winnerRunnerId == undefined ||
      findMarket.winnerRunnerId == "" ||
      findMarket.winnerRunnerId == null
    ) {
      let findBet = await Bet.find({ marketId: marketId });

      for (var i = 0; i < findBet.length; i++) {
        let newFindBet = await Bet.findOne({ userId: findBet[i].userId, marketId: findBet[i].marketId });
        let profit = 0;
        let loss = 0;
        if (findBet[i].isBack == true) {
          if (winRunnerId == findBet[i].marketRunnerId) {
            profit = (findBet[i].odds - 1).toFixed(2) * findBet[i].stake;
            newFindBet.betPl = profit;
          } else {
            loss = findBet[i].stake * -1;
            newFindBet.betPl = loss * -1;
          }
        } else {
          if (winRunnerId != findBet[i].marketRunnerId) {
            profit = findBet[i].stake;
            newFindBet.betPl = profit;
          } else {
            loss = (findBet[i].odds - 1).toFixed(2) * findBet[i].stake * -1;
            newFindBet.betPl = loss * -1;
          }
        }
        newFindBet.save();
        if (loss == 0) {
          await updateUserPl(findBet[i].userId, profit);
        } else {
          await updateUserPl(findBet[i].userId, loss);
        }
      }
      findMarket.winnerRunnerId = winRunnerId;
      findMarket.save();
      return reqBody;
    } else {
      throw new ErrorResponse("Winner already added.").status(200);
    }
  } catch (e) {
    throw new Error(e);
  }
};

export default {
  addBet,
  fetchAllBet,
  fetchUserEventBets,
  completeBet,
};
