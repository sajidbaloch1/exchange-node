import betService from "../../services/v1/betService.js";
import betRequest from "../../requests/v1/betRequest.js";


// Create a new bet
const createBet = async (req, res) => {
    const { body } = await betRequest.createBetRequest(req);

    const newBet = await betService.addBet({ ...body });

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
}
export default {
    createBet,
    getAllBet,
    betComplete
};