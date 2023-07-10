import Sport from "../models/Sport.js";
import sportService from "../services/sportService.js";

// Get all Sport
const getAllSport = async (req, res) => {
  const page = req.body?.page ? Number(req.body.page) : null;
  const perPage = req.body?.perPage ? Number(req.body.perPage) : null;
  const sortBy = req.body?.sortBy ? req.body.sortBy : "createdAt";
  const direction = req.body?.direction ? req.body.direction : "desc";
  const sports = await sportService.fetchAllSport({
    page,
    perPage,
    sortBy,
    direction,
  });

  return res.status(200).json({ success: true, data: sports });
};

// Get Sport by ID
const getSportById = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const user = await sportService.fetchSportId(_id);

  res.status(200).json({ success: true, data: { details: user } });
};

// Create a new sport
const createSport = async (req, res) => {
  const sport = req.sport;

  const name = req.body?.name ? req.body.name.trim() : null;

  if (!name) {
    throw new Error("name is required!");
  }
  const newsport = await sportService.addSport({
    name: name,
  });

  res.status(201).json({ success: true, data: { details: newsport } });
};

// Update a Sport
const updateSport = async (req, res) => {
  const _id = req.body?._id || null;
  const name = req.body?.name ? req.body.name : null;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const updatedSport = await sportService.modifySport({
    _id,
    name,
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

export default {
  getAllSport,
  getSportById,
  createSport,
  updateSport,
  deleteSport,
};
