import competitionRequest from "../../requests/v1/competitionRequest.js";
import competitionService from "../../services/v1/competitionService.js";

// Get all competitions
const getAllCompetition = async (req, res) => {
  const { body } = await competitionRequest.competitionListingRequest(req);

  const competitions = await competitionService.fetchAllCompetition({
    ...body,
  });

  return res.status(200).json({ success: true, data: competitions });
};

// Get competition by ID
const getCompetitionById = async (req, res) => {
  const { _id = null } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const competitions = await competitionService.fetchCompetitionId(_id);

  res.status(200).json({ success: true, data: { details: competitions } });
};

// Create a new competition
const createCompetition = async (req, res) => {
  const { body } = await competitionRequest.createCompetitionRequest(req);

  const newCompetition = await competitionService.addCometition({ ...body });

  res.status(201).json({ success: true, data: { details: newCompetition } });
};

// Update a competition
const updateCompetition = async (req, res) => {
  const { body } = await competitionRequest.updateCompetitionRequest(req);

  const updatedCompetition = await competitionService.modifyCompetition({
    ...body,
  });

  res
    .status(200)
    .json({ success: true, data: { details: updatedCompetition } });
};

// Delete a competition
const deleteCompetition = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const deletedCompetition = await competitionService.removeCompetition(_id);

  res
    .status(200)
    .json({ success: true, data: { details: deletedCompetition } });
};

const updateCompetitionStatus = async (req, res) => {
  const _id = req.body?._id || null;
  const isActive = req.body?.isActive || null;
  const isManual = req.body?.isManual || null;
  if (!_id) {
    throw new Error("_id is required!");
  }

  const updatedCompetitionStatus =
    await competitionService.competitionStatusModify({
      _id,
      isActive,
      isManual,
    });

  res
    .status(200)
    .json({ success: true, data: { details: updatedCompetitionStatus } });
};

export default {
  getAllCompetition,
  getCompetitionById,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  updateCompetitionStatus,
};
