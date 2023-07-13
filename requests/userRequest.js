import Yup from "yup";
import User, { USER_ACCESSIBLE_ROLES, USER_ROLE } from "../models/User.js";

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

async function createUserSchema(req) {
  req.body.rate = req.body?.rate ? Number(req.body.rate) : null;
  req.body.balance = req.body?.balance ? Number(req.body.balance) : null;
  req.body.currencyId = req.body?.currencyId || null;

  const user = await User.findById(req.user._id, { role: 1 });

  const requestSchema = Yup.object().shape({
    fullName: Yup.string().required(),

    username: Yup.string().required(),

    password: Yup.string().required(),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match.")
      .required(),

    rate: Yup.number().min(0).max(1).nullable(true),

    role: Yup.string()
      .oneOf(USER_ACCESSIBLE_ROLES[user.role], "Invalid user role!")
      .required(),

    balance: Yup.number().min(0).nullable(true),

    currencyId: Yup.string().nullable(true),

    city: Yup.string(),

    mobileNumber: Yup.string().length(10),
  });

  return requestSchema;
}

export default {
  listingSchema,
  createUserSchema,
};
