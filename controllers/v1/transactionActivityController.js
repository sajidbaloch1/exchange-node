import transactionActivityRequest from "../../requests/v1/transactionActivityRequest.js";
import transactionActivityService from "../../services/v1/transactionActivityService.js";

// Get all transactionActivitys
const getAllTransaction = async (req, res) => {
    const { user, body } = await transactionActivityRequest.transactionActivityListingRequest(req);

    const transactionActivitys = await transactionActivityService.fetchAllTransaction({ user, ...body });

    return res.status(200).json({ success: true, data: transactionActivitys });
};

// Create a new transaction
const createTransaction = async (req, res) => {
    const { body } = await transactionActivityRequest.createTransactionRequest(req);

    const newTransaction = await transactionActivityService.addTransaction({ ...body });

    res.status(201).json({ success: true, data: { details: newTransaction } });
};

export default {
    getAllTransaction,
    createTransaction
};













