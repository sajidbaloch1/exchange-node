import ruleService from "../../services/ruleService.js";

// Get all rule
const getAllRule = async (req, res) => {
  const page = req.body?.page ? Number(req.body.page) : null;
  const perPage = req.body?.perPage ? Number(req.body.perPage) : null;
  const sortBy = req.body?.sortBy ? req.body.sortBy : "createdAt";
  const direction = req.body?.direction ? req.body.direction : "desc";
  const showDeleted = req.body?.showDeleted
    ? req.body.showDeleted === true || req.body.showDeleted === "true"
    : false;
  const searchQuery = req.body?.searchQuery || null;

  const rule = await ruleService.fetchAllRule({
    page,
    perPage,
    sortBy,
    direction,
    showDeleted,
    searchQuery,
  });

  return res.status(200).json({ success: true, data: rule });
};

// Get rule by ID
const getRuleById = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const rule = await ruleService.fetchRuleId(_id);

  res.status(200).json({ success: true, data: { details: rule } });
};

// Create a new rule
const createRule = async (req, res) => {
  const gameType = req.body?.gameType ? req.body.gameType.trim() : null;
  const casinoId = req.body?.casinoId ? req.body.casinoId.trim() : null;
  const sportsId = req.body?.sportsId ? req.body.sportsId.trim() : null;
  const betCatId = req.body?.betCatId ? req.body.betCatId.trim() : null;
  const notes = req.body?.notes ? req.body.notes : null;

  if (!gameType) {
    throw new Error("Game Type is required!");
  }
  if (!betCatId) {
    throw new Error("Bet Catergory id is required!");
  }
  const newRule = await ruleService.addRule({
    gameType,
    casinoId,
    sportsId,
    betCatId,
    notes,
  });

  res.status(201).json({ success: true, data: { details: newRule } });
};

// Update a rule
const updateRule = async (req, res) => {
  const _id = req.body?._id || null;
  const gameType = req.body?.gameType ? req.body.gameType.trim() : null;
  const casinoId = req.body?.casinoId ? req.body.casinoId.trim() : null;
  const sportsId = req.body?.sportsId ? req.body.sportsId.trim() : null;
  const betCatId = req.body?.betCatId ? req.body.betCatId.trim() : null;
  const notes = req.body?.notes ? req.body.notes : null;

  if (!gameType) {
    throw new Error("Game Type is required!");
  }
  if (!betCatId) {
    throw new Error("Bet Catergory id is required!");
  }
  if (!_id) {
    throw new Error("_id is required!");
  }

  const updatedRule = await ruleService.modifyRule({
    _id,
    gameType,
    casinoId,
    sportsId,
    betCatId,
    notes,
  });

  res.status(200).json({ success: true, data: { details: updatedRule } });
};

// Delete a rule
const deleteRule = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const deletedRule = await ruleService.removeRule(_id);

  res.status(200).json({ success: true, data: { details: deletedRule } });
};

export default {
  getAllRule,
  getRuleById,
  createRule,
  updateRule,
  deleteRule,
};
