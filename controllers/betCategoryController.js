import betCategoryService from "../services/betCategoryService.js";

// Get all bet-category
const getAllBetCategory = async (req, res) => {
  const page = req.body?.page ? Number(req.body.page) : null;
  const perPage = req.body?.perPage ? Number(req.body.perPage) : null;
  const sortBy = req.body?.sortBy ? req.body.sortBy : "createdAt";
  const direction = req.body?.direction ? req.body.direction : "desc";
  const showDeleted = req.body?.showDeleted
    ? req.body.showDeleted === true || req.body.showDeleted === "true"
    : false;
  const searchQuery = req.body?.searchQuery || null;

  const betCategory = await betCategoryService.fetchAllBetCategory({
    page,
    perPage,
    sortBy,
    direction,
    showDeleted,
    searchQuery,
  });

  return res.status(200).json({ success: true, data: betCategory });
};

// Get bet-category by ID
const getBetCategoryById = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const betCategory = await betCategoryService.fetchBetCategoryId(_id);

  res.status(200).json({ success: true, data: { details: betCategory } });
};

// Create a new bet-category
const createBetCategory = async (req, res) => {

  const name = req.body?.name ? req.body.name.trim() : null;

  if (!name) {
    throw new Error("Name is required!");
  }
  const newBetCategory = await betCategoryService.addBetCategory({
    name: name,
  });

  res.status(201).json({ success: true, data: { details: newBetCategory } });
};

// Update a bet-category
const updateBetCategory = async (req, res) => {
  const _id = req.body?._id || null;
  const name = req.body?.name ? req.body.name : null;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const updatedBetCategory = await betCategoryService.modifyBetCategory({
    _id,
    name,
  });

  res.status(200).json({ success: true, data: { details: updatedBetCategory } });
};

// Delete a bet-category
const deleteBetCategory = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const deletedBetCategory = await betCategoryService.removeBetCategory(_id);

  res.status(200).json({ success: true, data: { details: deletedBetCategory } });
};

export default {
  getAllBetCategory,
  getBetCategoryById,
  createBetCategory,
  updateBetCategory,
  deleteBetCategory,
};
