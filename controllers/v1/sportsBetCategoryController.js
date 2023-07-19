import sportsBetCategoryService from "../../services/v1/sportsBetCategoryService.js";

// Get all sports-bet-category
const getAllSportsBetCategory = async (req, res) => {
  const page = req.body?.page ? Number(req.body.page) : null;
  const perPage = req.body?.perPage ? Number(req.body.perPage) : null;
  const sortBy = req.body?.sortBy ? req.body.sortBy : "createdAt";
  const direction = req.body?.direction ? req.body.direction : "desc";
  const showDeleted = req.body?.showDeleted
    ? req.body.showDeleted === true || req.body.showDeleted === "true"
    : false;
  const searchQuery = req.body?.searchQuery || null;

  const sportsBetCategory = await sportsBetCategoryService.fetchAllSportsBetCategory({
    page,
    perPage,
    sortBy,
    direction,
    showDeleted,
    searchQuery,
  });

  return res.status(200).json({ success: true, data: sportsBetCategory });
};

// Get sports-bet-category by ID
const getSportsBetCategoryById = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const sportsBetCategory = await sportsBetCategoryService.fetchSportsBetCategoryId(_id);

  res.status(200).json({ success: true, data: { details: sportsBetCategory } });
};

// Create a new sports-bet-category
const createSportsBetCategory = async (req, res) => {

  const sportsId = req.body?.sportsId ? req.body.sportsId.trim() : null;
  const betCatId = req.body?.betCatId ? req.body.betCatId.trim() : null;
  const maxBet = req.body?.maxBet ? req.body.maxBet.trim() : null;
  const minBet = req.body?.minBet ? req.body.minBet.trim() : null;

  if (!sportsId) {
    throw new Error("Sports Id is required!");
  }
  if (!betCatId) {
    throw new Error("Bet Category Id is required!");
  }
  const newSportsBetCategory = await sportsBetCategoryService.addSportsBetCategory({
    sportsId,
    betCatId,
    maxBet,
    minBet,
  });

  res.status(201).json({ success: true, data: { details: newSportsBetCategory } });
};

// Update a sports-bet-category
const updateSportsBetCategory = async (req, res) => {
  const _id = req.body?._id || null;
  const sportsId = req.body?.sportsId ? req.body.sportsId.trim() : null;
  const betCatId = req.body?.betCatId ? req.body.betCatId.trim() : null;
  const maxBet = req.body?.maxBet ? req.body.maxBet.trim() : null;
  const minBet = req.body?.minBet ? req.body.minBet.trim() : null;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const updatedSportsBetCategory = await sportsBetCategoryService.modifySportsBetCategory({
    _id,
    sportsId,
    betCatId,
    maxBet,
    minBet,
  });

  res.status(200).json({ success: true, data: { details: updatedSportsBetCategory } });
};

// Delete a sports-bet-category
const deleteSportsBetCategory = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const deletedSportsBetCategory = await sportsBetCategoryService.removeSportsBetCategory(_id);

  res.status(200).json({ success: true, data: { details: deletedSportsBetCategory } });
};

export default {
  getAllSportsBetCategory,
  getSportsBetCategoryById,
  createSportsBetCategory,
  updateSportsBetCategory,
  deleteSportsBetCategory,
};
