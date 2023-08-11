import transferRequestRequest from "../../requests/v1/transferRequestRequest.js";
import transferRequestService from "../../services/v1/transferRequestService.js";

// Get all transferRequests
const getAllTransferRequest = async (req, res) => {
  const { body } = await transferRequestRequest.transferRequestListingRequest(req);

  const transferRequests = await transferRequestService.fetchAllTransferRequest({ ...body });

  return res.status(200).json({ success: true, data: transferRequests });
};

// Get transferRequest by ID
const getTransferRequestById = async (req, res) => {
  const { _id = null } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const transferRequests = await transferRequestService.fetchTransferRequestId(_id);

  res.status(200).json({ success: true, data: { details: transferRequests } });
};

// Create a new transferRequest
const createTransferRequest = async (req, res) => {
  const { body } = await transferRequestRequest.createTransferRequestRequest(req);

  const newTransferRequest = await transferRequestService.addTransferRequest({ ...body });

  res.status(201).json({ success: true, data: { details: newTransferRequest } });
};

// Update a transferRequest
const updateTransferRequest = async (req, res) => {
  const { body } = await transferRequestRequest.updateTransferRequestRequest(req);

  const updatedTransferRequest = await transferRequestService.modifyTransferRequest({ ...body });

  res.status(200).json({ success: true, data: { details: updatedTransferRequest } });
};

// Delete a transferRequest
const deleteTransferRequest = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const deletedTransferRequest = await transferRequestService.removeTransferRequest(_id);

  res.status(200).json({ success: true, data: { details: deletedTransferRequest } });
};

const updateTransferRequestStatus = async (req, res) => {
  const _id = req.body?._id || null;
  const fieldName = req.body?.fieldName || null;
  const status = req.body?.status || null;

  if (!(_id && fieldName && status)) {
    throw new Error("_id && fieldName && status is required!");
  }

  const updatedTransferRequestStatus = await transferRequestService.transferRequestStatusModify({
    _id,
    fieldName,
    status,
  });

  res.status(200).json({ success: true, data: { details: updatedTransferRequestStatus } });
};

export default {
  getAllTransferRequest,
  getTransferRequestById,
  createTransferRequest,
  updateTransferRequest,
  deleteTransferRequest,
  updateTransferRequestStatus,
};
