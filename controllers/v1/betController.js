import betRequest from "../../requests/v1/betRequest.js";
import betService from "../../services/v1/betService.js";

// Create a new bet
const createBet = async (req, res) => {
  const { body } = await betRequest.createBetRequest(req);

  const newBet = await betService.addBet({ user: req.user, ...body });

  res.status(201).json({ success: true, data: { details: newBet } });
};

// Get list bet

const getAllBet = async (req, res) => {
  const { body } = await betRequest.getAllBetRequest(req);

  const newBet = await betService.fetchAllBet({ ...body });

  res.status(201).json({ success: true, data: { details: newBet } });
};

// Bet complete

const betComplete = async (req, res) => {
  const { body } = await betRequest.betCompleteRequest(req);

  const completeBet = await betService.completeBet({ ...body });

  res.status(201).json({ success: true, data: { details: completeBet } });
};
// Settlement

const settlement = async (req, res) => {
  const { body } = await betRequest.settlementRequest(req);
  const settlement = await betService.settlement({ ...body });
  res.status(201).json({ success: true, data: { details: settlement } });
};

const getChildUserData = async (req, res) => {
  const { userId, filterUserId = "" } = req.body;

  if (!userId) {
    throw new Error("_id is required!");
  }

  const getChildUserData = await betService.getChildUserData({ userId, filterUserId });
  res.status(201).json({ success: true, data: { details: getChildUserData } });
};

export default {
  createBet,
  getAllBet,
  betComplete,
  settlement,
  getChildUserData,
};
