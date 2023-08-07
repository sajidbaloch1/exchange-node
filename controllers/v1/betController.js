import betService from "../../services/v1/betService.js";
import betRequest from "../../requests/v1/betRequest.js";


// Create a new bet
const createBet = async (req, res) => {
    const { body } = await betRequest.createBetRequest(req);

    const newBet = await betService.addBet({ ...body });

    res.status(201).json({ success: true, data: { details: newBet } });
};

export default {
    createBet,
};