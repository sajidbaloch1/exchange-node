import exchangeHomeService from "../../services/v1/exchangeHomeService.js";

// Get sports list
const getSportsList = async (req, res) => {

    const sprtsList = await exchangeHomeService.sportsList();

    res.status(200).json({ success: true, data: sprtsList });
};

export default {
    getSportsList
};