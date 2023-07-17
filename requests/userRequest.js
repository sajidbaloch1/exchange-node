import Yup from "yup";
import User, { USER_ACCESSIBLE_ROLES, USER_ROLE } from "../models/User.js";
import { isValidObjectId } from "mongoose";

async function userListingRequest(req) {
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
  req.body.parentId = req.body?.parentId || null;

  const validationSchema = Yup.object().shape({
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

    parentId: Yup.string()
      .nullable()
      .test("validId", "Invalid parentId!", (v) =>
        v === null ? true : isValidObjectId(v)
      ),
  });

  await validationSchema.validate(req.body);

  return req;
}

async function createUserRequest(req) {
  req.body.rate = req.body?.rate ? Number(req.body.rate) : null;
  req.body.creditPoints = req.body?.creditPoints
    ? Number(req.body.creditPoints)
    : null;
  req.body.currencyId = req.body?.currencyId || null;

  const user = await User.findById(req.user._id, { role: 1 });

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required(),

    username: Yup.string().required(),

    password: Yup.string().required(),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match.")
      .required(),

    rate: Yup.number().min(0).max(100).nullable(true),

    role: Yup.string()
      .oneOf(USER_ACCESSIBLE_ROLES[user.role], "Invalid user role!")
      .required(),

    creditPoints: Yup.number().min(0).nullable(true),

    currencyId: Yup.string().nullable(true),

    city: Yup.string(),

    mobileNumber: Yup.string().length(10).required(),
  });

  await validationSchema.validate(req.body);

  return req;
}

async function updateUserRequest(req) {
  req.body._id = req.body?._id || null;
  req.body.rate = req.body?.rate ? Number(req.body.rate) : null;
  req.body.creditPoints = req.body?.creditPoints
    ? Number(req.body.creditPoints)
    : null;
  req.body.password = req.body?.password || null;

  const validationSchema = Yup.object().shape({
    _id: Yup.string()
      .required()
      .test("_id", "Given _id is not valid!", (v) => isValidObjectId(v)),

    fullName: Yup.string().required(),

    password: Yup.string().nullable(true),

    confirmPassword: Yup.string()
      .nullable(true)
      .when(["password"], (password, schema) => {
        return password
          ? schema
            .oneOf([Yup.ref("password")], "Passwords should match.")
            .required()
          : schema;
      }),

    rate: Yup.number().min(0).max(100).nullable(true),

    creditPoints: Yup.number().min(0),

    city: Yup.string(),

    mobileNumber: Yup.string().length(10),
  });

  await validationSchema.validate(req.body);

  return req;
}

async function fetchUserBalanceRequest(req) {

  const validationSchema = Yup.object().shape({
    userId: Yup.string().required(),
  });

  await validationSchema.validate(req.body);

  return req;
}

export default {
  userListingRequest,
  createUserRequest,
  updateUserRequest,
  fetchUserBalanceRequest
};
