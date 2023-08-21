import casinoRequest from "../../requests/v1/casinoRequest.js";
import casinoService from "../../services/v1/casinoService.js";

// Get all casinos
const getAllCasino = async (req, res) => {
  const { body } = await casinoRequest.casinoListingRequest(req);

  const casinos = await casinoService.fetchAllCasino({ ...body });

  return res.status(200).json({ success: true, data: casinos });
};

// Get casino by ID
const getCasinoById = async (req, res) => {
  const { _id = null } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const casinos = await casinoService.fetchCasinoId(_id);

  res.status(200).json({ success: true, data: { details: casinos } });
};

// Create a new casino
const createCasino = async (req, res) => {
  const { body } = await casinoRequest.createCasinoRequest(req);

  const newCasino = await casinoService.addCasino({ ...body, files: req.files });

  res.status(201).json({ success: true, data: { details: newCasino } });
};

// Update a casino
const updateCasino = async (req, res) => {
  const { body } = await casinoRequest.updateCasinoRequest(req);

  const updatedCasino = await casinoService.modifyCasino({ ...body, files: req.files });

  res.status(200).json({ success: true, data: { details: updatedCasino } });
};

// Delete a casino
const deleteCasino = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const deletedCasino = await casinoService.removeCasino(_id);

  res.status(200).json({ success: true, data: { details: deletedCasino } });
};

const updateCasinoStatus = async (req, res) => {
  const _id = req.body?._id || null;
  const fieldName = req.body?.fieldName || null;
  const status = req.body?.status || null;

  if (!(_id && fieldName && status)) {
    throw new Error("_id && fieldName && status is required!");
  }

  const updatedCasinoStatus = await casinoService.casinoStatusModify({
    _id,
    fieldName,
    status,
  });

  res.status(200).json({ success: true, data: { details: updatedCasinoStatus } });
};


export default {
  getAllCasino,
  getCasinoById,
  createCasino,
  updateCasino,
  deleteCasino,
  updateCasinoStatus,

};
