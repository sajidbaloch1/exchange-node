import TransactionUserRequest from "../../requests/v1/transactionUserRequest.js";
import TransactionUserService from "../../services/v1/transactionUserService.js";

// Create a new Transaction user
const createTransactionUser = async (req, res) => {
  const { user, body } = await TransactionUserRequest.createTransactionUserRequest(req);

  const newTransactionUser = await TransactionUserService.addTransactionUser({ user, ...body });

  res.status(201).json({ success: true, data: { details: newTransactionUser } });
};

// Get Transaction user by ID
const getTransactionUserById = async (req, res) => {
  const { _id = null, fields = {} } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const TransactionUser = await TransactionUserService.fetchTransactionUserId(_id, fields);

  res.status(200).json({ success: true, data: { details: TransactionUser } });
};

// Update a Transaction user
const updateTransactionUser = async (req, res) => {
  const { user, body } = await TransactionUserRequest.updateTransactionUserRequest(req);

  const updatedTransactionUser = await TransactionUserService.modifyTransactionUser({ user, ...body });

  res.status(200).json({ success: true, data: { details: updatedTransactionUser } });
};

// Get all Transaction users
const getAllTransactionUser = async (req, res) => {
  const { user, body } = await TransactionUserRequest.userListingRequest(req);

  const TransactionUsers = await TransactionUserService.fetchAllTransactionUsers({ user, ...body });

  return res.status(200).json({ success: true, data: TransactionUsers });
};

// Delete a Transaction user
const deleteTransactionUser = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const deletedTransactionUser = await TransactionUserService.removeTransactionUser(_id);

  res.status(200).json({ success: true, data: { details: deletedTransactionUser } });
};

// Login a Transaction user
const loginTransactionUser = async (req, res) => {
  const { user, body } = await TransactionUserRequest.transactionUserLoginRequest(req);

  const TransactionUser = await TransactionUserService.loginTransactionUser({ user, ...body });
  res.status(200).json({ success: true, data: TransactionUser });
};

/**
 * Resets the Transaction user password.
 *
 **/
const resetPassword = async (req, res) => {
  const { body } = await TransactionUserRequest.transactionUserResetPasswordRequest(req);

  const resetPasswordUser = await TransactionUserService.resetPassword({ ...body });
  return res.status(200).json({ success: true, data: resetPasswordUser });
};

export default {
  createTransactionUser,
  getTransactionUserById,
  updateTransactionUser,
  getAllTransactionUser,
  deleteTransactionUser,
  loginTransactionUser,
  resetPassword,
};
