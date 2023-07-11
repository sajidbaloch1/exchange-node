import {
  generatePaginationQueries,
  generateSearchFilters,
} from "../lib/filter-helper.js";
import Category from "../models/Category.js";

// Fetch all Category from the database
const fetchAllCategory = async ({
  page,
  perPage,
  sortBy,
  direction,
  showDeleted,
  searchQuery,
}) => {
  try {
    const sortDirection = direction === "asc" ? 1 : -1;

    const paginationQueries = generatePaginationQueries(page, perPage);

    const filters = {
      isDeleted: showDeleted,
    };

    if (searchQuery) {
      const fields = ["name"];
      filters.$or = generateSearchFilters(searchQuery, fields);
    }

    const category = await Category.aggregate([
      {
        $match: filters,
      },
      {
        $facet: {
          totalRecords: [{ $count: "count" }],
          paginatedResults: [
            {
              $sort: { [sortBy]: sortDirection },
            },
            ...paginationQueries,
          ],
        },
      },
    ]);

    const data = {
      records: [],
      totalRecords: 0,
    };

    if (category?.length) {
      data.records = category[0]?.paginatedResults || [];
      data.totalRecords = category[0]?.totalRecords?.length
        ? category[0]?.totalRecords[0].count
        : 0;
    }

    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Fetch Category by Id from the database
 */
const fetchCategoryId = async (_id) => {
  try {
    const category = await Category.findById(_id);

    return category;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * create Category in the database
 */
const addCategory = async ({ name }) => {
  try {
    const existingCategory = await Category.findOne({ name: name });
    if (existingCategory) {
      throw new Error("name already exists!");
    }

    const newCategoryObj = {
      name: name,
    };
    const newcategory = await Category.create(newCategoryObj);

    return newcategory;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * update Category in the database
 */
const modifyCategory = async ({ _id, name }) => {
  try {
    const category = await Category.findById(_id);

    category.name = name;

    await category.save();

    return category;
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * delete Category in the database
 */
const removeCategory = async (_id) => {
  try {
    const category = await Category.findById(_id);

    await category.softDelete();

    return category;
  } catch (e) {
    throw new Error(e.message);
  }
};

export default {
  fetchAllCategory,
  fetchCategoryId,
  addCategory,
  modifyCategory,
  removeCategory,
};
