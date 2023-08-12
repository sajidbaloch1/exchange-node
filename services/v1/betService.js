import Bet from "../../models/v1/Bet.js";

/**
 * create Bet in the database
 */
const addBet = async ({ ...reqBody }) => {
  try {
    const {
      userId,
      marketId,
      eventId,
      odds,
      stake,
      isBack,
      betOrderType,
      betOrderStatus,
      betResultStatus,
      betPl,
      deviceInfo,
      ipAddress,
    } = reqBody;

    const newBetObj = {
      userId,
      marketId,
      eventId,
      odds,
      stake,
      isBack,
      betOrderType,
      betOrderStatus,
      betResultStatus,
      betPl,
      deviceInfo,
      ipAddress,
    };
    const newBet = await Bet.create(newBetObj);

    return newBet;
  } catch (e) {
    throw new Error(e);
  }
};

export default {
  addBet,
};
