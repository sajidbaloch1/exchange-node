import transactionActivityRequest from "../../requests/v1/transactionActivityRequest.js";
import transactionActivityService from "../../services/v1/transactionActivityService.js";

// Get all transactionActivitys
const getAllTransaction = async (req, res) => {
    const { body } = await transactionActivityRequest.transactionActivityListingRequest(req);

    const transactionActivitys = await transactionActivityService.fetchAllTransaction({ ...body });

    return res.status(200).json({ success: true, data: transactionActivitys });
};

export default {
    getAllTransaction,
};