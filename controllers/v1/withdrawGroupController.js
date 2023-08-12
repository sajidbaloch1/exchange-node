import withdrawGroupRequest from "../../requests/v1/withdrawGroupRequest.js";
import withdrawGroupService from "../../services/v1/withdrawGroupService.js";

// Get all withdrawGroups
const getAllWithdrawGroup = async (req, res) => {
  const { body } = await withdrawGroupRequest.withdrawGroupListingRequest(req);

  const withdrawGroups = await withdrawGroupService.fetchAllWithdrawGroup({ ...body });

  return res.status(200).json({ success: true, data: withdrawGroups });
};

// Get withdrawGroup by ID
const getWithdrawGroupById = async (req, res) => {
  const { _id = null } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const withdrawGroups = await withdrawGroupService.fetchWithdrawGroupId(_id);

  res.status(200).json({ success: true, data: { details: withdrawGroups } });
};

// Create a new withdrawGroup
const createWithdrawGroup = async (req, res) => {
  const { body } = await withdrawGroupRequest.createWithdrawGroupRequest(req);

  const newWithdrawGroup = await withdrawGroupService.addWithdrawGroup({ ...body });

  res.status(201).json({ success: true, data: { details: newWithdrawGroup } });
};

// Update a withdrawGroup
const updateWithdrawGroup = async (req, res) => {
  const { body } = await withdrawGroupRequest.updateWithdrawGroupRequest(req);

  const updatedWithdrawGroup = await withdrawGroupService.modifyWithdrawGroup({ ...body });

  res.status(200).json({ success: true, data: { details: updatedWithdrawGroup } });
};

// Delete a withdrawGroup
const deleteWithdrawGroup = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const deletedWithdrawGroup = await withdrawGroupService.removeWithdrawGroup(_id);

  res.status(200).json({ success: true, data: { details: deletedWithdrawGroup } });
};

const updateWithdrawGroupStatus = async (req, res) => {
  const _id = req.body?._id || null;
  const fieldName = req.body?.fieldName || null;
  const status = req.body?.status || null;

  if (!(_id && fieldName && status)) {
    throw new Error("_id && fieldName && status is required!");
  }

  const updatedWithdrawGroupStatus = await withdrawGroupService.withdrawGroupStatusModify({
    _id,
    fieldName,
    status,
  });

  res.status(200).json({ success: true, data: { details: updatedWithdrawGroupStatus } });
};

export default {
  getAllWithdrawGroup,
  getWithdrawGroupById,
  createWithdrawGroup,
  updateWithdrawGroup,
  deleteWithdrawGroup,
  updateWithdrawGroupStatus,
};
