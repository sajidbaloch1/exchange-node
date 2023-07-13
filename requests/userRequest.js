import Yup from "yup";
import User, { USER_ROLE } from "../models/User.js";

async function listingSchema(req) {
  req.body.page = req.body?.page ? Number(req.body.page) : null;
  req.body.perPage = req.body?.perPage ? Number(req.body.perPage) : 10;
  req.body.sortBy = req.body?.sortBy ? req.body.sortBy : "createdAt";
  req.body.direction = req.body?.direction ? req.body.direction : "desc";
  req.body.searchQuery = req.body?.searchQuery
    ? req.body.searchQuery?.trim()
    : null;
  req.body.role = req.body?.role ? req.body.role : null;
  req.body.showDeleted = req.body?.showDeleted
    ? [true, "true"].includes(req.body.showDeleted)
    : false;

  const requestSchema = Yup.object().shape({
    page: Yup.number().nullable(true),

    perPage: Yup.number(),

    sortBy: Yup.string().oneOf(
      Object.keys(User.schema.paths),
      "Invalid sortBy key."
    ),

    direction: Yup.string()
      .oneOf(["asc", "desc", null], "Invalid direction use 'asc' or 'desc'.")
      .nullable(true),

    showDeleted: Yup.boolean(),

    role: Yup.string()
      .oneOf(Object.values(USER_ROLE), "Invalid role.")
      .nullable(true),

    searchQuery: Yup.string().nullable(true),
  });

  return requestSchema;
}

export default {
  listingSchema,
};
