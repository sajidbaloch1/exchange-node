import categoryService from "../services/categoryService.js";

// Get all category
const getAllCategory = async (req, res) => {
  const page = req.body?.page ? Number(req.body.page) : null;
  const perPage = req.body?.perPage ? Number(req.body.perPage) : null;
  const sortBy = req.body?.sortBy ? req.body.sortBy : "createdAt";
  const direction = req.body?.direction ? req.body.direction : "desc";
  const showDeleted = req.body?.showDeleted
    ? req.body.showDeleted === true || req.body.showDeleted === "true"
    : false;
  const searchQuery = req.body?.searchQuery || null;

  const category = await categoryService.fetchAllCategory({
    page,
    perPage,
    sortBy,
    direction,
    showDeleted,
    searchQuery,
  });

  return res.status(200).json({ success: true, data: category });
};

// Get category by ID
const getCategoryById = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const category = await categoryService.fetchCategoryId(_id);

  res.status(200).json({ success: true, data: { details: category } });
};

// Create a new category
const createCategory = async (req, res) => {
  const category = req.category;

  const name = req.body?.name ? req.body.name.trim() : null;

  if (!name) {
    throw new Error("name is required!");
  }
  const newcategory = await categoryService.addCategory({
    name: name,
  });

  res.status(201).json({ success: true, data: { details: newcategory } });
};

// Update a category
const updateCategory = async (req, res) => {
  const _id = req.body?._id || null;
  const name = req.body?.name ? req.body.name : null;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const updatedCategory = await categoryService.modifyCategory({
    _id,
    name,
  });

  res.status(200).json({ success: true, data: { details: updatedCategory } });
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required!");
  }

  const deletedCategory = await categoryService.removeCategory(_id);

  res.status(200).json({ success: true, data: { details: deletedCategory } });
};

export default {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
