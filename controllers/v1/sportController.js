import { BET_CATEGORY } from "../../models/v1/Sport.js";
import sportService from "../../services/v1/sportService.js";

// Get all sport
const getAllSport = async (req, res) => {
  const page = req.body?.page ? Number(req.body.page) : null;
  const perPage = req.body?.perPage ? Number(req.body.perPage) : null;
  const sortBy = req.body?.sortBy ? req.body.sortBy : "createdAt";
  const direction = req.body?.direction ? req.body.direction : "desc";
  const showDeleted = req.body?.showDeleted
    ? req.body.showDeleted === true || req.body.showDeleted === "true"
    : false;
  const searchQuery = req.body?.searchQuery || null;

  const sport = await sportService.fetchAllSport({
    page,
    perPage,
    sortBy,
    direction,
    showDeleted,
    searchQuery,
  });

  return res.status(200).json({ success: true, data: sport });
};

// Get sport by ID
const getSportById = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const sport = await sportService.fetchSportId(_id);

  res.status(200).json({ success: true, data: { details: sport } });
};

// Create a new sport
const createSport = async (req, res) => {
  const name = req.body?.name ? req.body.name.trim() : null;
  const betCategory = req.body?.betCategory || [];
  if (!name) {
    throw new Error("name is required!");
  }
  const newsport = await sportService.addSport({
    name: name,
    betCategory: betCategory,
  });

  res.status(201).json({ success: true, data: { details: newsport } });
};

// Update a sport
const updateSport = async (req, res) => {
  const _id = req.body?._id || null;
  const name = req.body?.name ? req.body.name : null;
  const betCategory = req.body?.betCategory || [];

  if (!_id) {
    throw new Error("_id is required!");
  }

  const updatedSport = await sportService.modifySport({
    _id,
    name,
    betCategory,
  });

  res.status(200).json({ success: true, data: { details: updatedSport } });
};

// Delete a sport
const deleteSport = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const deletedSport = await sportService.removeSport(_id);

  res.status(200).json({ success: true, data: { details: deletedSport } });
};

const getBetCategory = async (req, res) => {
  const categories = [];

  Object.values(BET_CATEGORY).forEach((category) => {
    categories.push({
      value: category,
      label: category
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    });
  });

  res.status(200).json({ success: true, data: { details: categories } });
};

export default {
  getAllSport,
  getSportById,
  createSport,
  updateSport,
  deleteSport,
  getBetCategory,
};