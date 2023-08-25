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

const getUserEventBets = async (req, res) => {
  const { eventId } = req.body;

  if (!eventId) {
    throw new Error("Event id is required");
  }

  const eventBets = await betService.fetchUserEventBets({ eventId, userId: req.user._id });

  res.status(201).json({ success: true, data: { details: eventBets } });
};

// Bet complete
const betComplete = async (req, res) => {
  const { body } = await betRequest.betCompleteRequest(req);

  const completeBet = await betService.completeBet({ ...body });

  res.status(201).json({ success: true, data: { details: completeBet } });
};
export default {
  createBet,
  getAllBet,
  getUserEventBets,
  betComplete,
};
