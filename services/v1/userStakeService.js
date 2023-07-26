import ErrorResponse from "../../lib/error-handling/error-response.js";

import UserStake from "../../models/v1/UserStake.js";

/**
 * Fetch Stake by Id from the database
 */
const fetchStakeById = async (_id) => {
  try {
    const stake = await UserStake.findById(_id);

    return stake;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * create Stake in the database
 */
const addStake = async ({ userId, inputValues }) => {
  try {
    const newStakeObj = {
      userId: userId,
      inputValues: inputValues,
    };
    const newstake = await UserStake.create(newStakeObj);

    return newstake;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * update Stake in the database
 */
const modifyStake = async ({ _id, inputValues }) => {
  try {
    if (!_id) {
      throw new Error("Missing _id in the request body.");
    }

    const stake = await UserStake.findById(_id);

    if (!stake) {
      throw new Error("Stake not found.");
    }

    stake.inputValues = inputValues;
    await stake.save();

    return stake;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};
export default {
  fetchStakeById,
  addStake,
  modifyStake,
};
