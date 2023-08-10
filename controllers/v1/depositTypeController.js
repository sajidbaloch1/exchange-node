import depositTypeRequest from "../../requests/v1/depositTypeRequest.js";
import depositTypeService from "../../services/v1/depositTypeService.js";

// Get all depositTypes
const getAllDepositType = async (req, res) => {
  const { body } = await depositTypeRequest.depositTypeListingRequest(req);

  const depositTypes = await depositTypeService.fetchAllDepositType({ ...body });

  return res.status(200).json({ success: true, data: depositTypes });
};

// Get depositType by ID
const getDepositTypeById = async (req, res) => {
  const { _id = null } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const depositTypes = await depositTypeService.fetchDepositTypeId(_id);

  res.status(200).json({ success: true, data: { details: depositTypes } });
};

// Create a new depositType
const createDepositType = async (req, res) => {
  const { body } = await depositTypeRequest.createDepositTypeRequest(req);

  const newDepositType = await depositTypeService.addDepositType({ ...body });

  res.status(201).json({ success: true, data: { details: newDepositType } });
};

// Update a depositType
const updateDepositType = async (req, res) => {
  const { body } = await depositTypeRequest.updateDepositTypeRequest(req);

  const updatedDepositType = await depositTypeService.modifyDepositType({ ...body });

  res.status(200).json({ success: true, data: { details: updatedDepositType } });
};

// Delete a depositType
const deleteDepositType = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const deletedDepositType = await depositTypeService.removeDepositType(_id);

  res.status(200).json({ success: true, data: { details: deletedDepositType } });
};

const updateDepositTypeStatus = async (req, res) => {
  const _id = req.body?._id || null;
  const fieldName = req.body?.fieldName || null;
  const status = req.body?.status || null;

  if (!(_id && fieldName && status)) {
    throw new Error("_id && fieldName && status is required!");
  }

  const updatedDepositTypeStatus = await depositTypeService.depositTypeStatusModify({
    _id,
    fieldName,
    status,
  });

  res.status(200).json({ success: true, data: { details: updatedDepositTypeStatus } });
};

export default {
  getAllDepositType,
  getDepositTypeById,
  createDepositType,
  updateDepositType,
  deleteDepositType,
  updateDepositTypeStatus,
};
