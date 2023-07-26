import userStakeService from "../../services/v1/userStakeService.js";

// Get all stake
const getAllStake = async (req, res) => {
  const page = req.body?.page ? Number(req.body.page) : null;
  const perPage = req.body?.perPage ? Number(req.body.perPage) : null;
  const sortBy = req.body?.sortBy ? req.body.sortBy : "createdAt";
  const direction = req.body?.direction ? req.body.direction : "desc";
  const showDeleted = req.body?.showDeleted ? req.body.showDeleted === true || req.body.showDeleted === "true" : false;
  const searchQuery = req.body?.searchQuery || null;

  const stake = await userStakeService.fetchAllStake({
    page,
    perPage,
    sortBy,
    direction,
    showDeleted,
    searchQuery,
  });

  return res.status(200).json({ success: true, data: stake });
};

// Get stake by ID
const getStakeById = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const stake = await userStakeService.fetchStakeId(_id);

  res.status(200).json({ success: true, data: { details: stake } });
};

// Create a new stake
const createStake = async (req, res) => {
  const inputValues = req.body?.inputValues || [];

  if (!inputValues) {
    throw new Error("inputValues is required!");
  }
  const newstake = await userStakeService.addStake({
    userId: req.user._id,
    inputValues,
  });

  res.status(201).json({ success: true, data: { details: newstake } });
};

// Update a stake
const updateStake = async (req, res) => {
  const _id = req.body?._id || null;
  const inputValues = req.body?.inputValues ? req.body.inputValues : null;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const updatedStake = await userStakeService.modifyStake({
    _id,
    inputValues,
  });

  res.status(200).json({
    success: true,
    data: { details: updatedStake },
    message: "Stake Updated",
  });
};
export default {
  getAllStake,
  getStakeById,
  createStake,
  updateStake,
};
