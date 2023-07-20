import { isValidObjectId } from "mongoose";
import Yup from "yup";
import User, { USER_ACCESSIBLE_ROLES, USER_ROLE } from "../../models/v1/User.js";

async function userListingRequest(req) {
  req.body.page = req.body?.page ? Number(req.body.page) : null;
  req.body.perPage = req.body?.perPage ? Number(req.body.perPage) : 10;
  req.body.sortBy = req.body?.sortBy ? req.body.sortBy : "createdAt";
  req.body.direction = req.body?.direction ? req.body.direction : "desc";
  req.body.searchQuery = req.body?.searchQuery ? req.body.searchQuery?.trim() : null;
  req.body.role = req.body?.role ? req.body.role : null;
  req.body.showDeleted = req.body?.showDeleted ? [true, "true"].includes(req.body.showDeleted) : false;
  req.body.parentId = req.body?.parentId || null;

  const validationSchema = Yup.object().shape({
    page: Yup.number().nullable(true),

    perPage: Yup.number(),

    sortBy: Yup.string().oneOf(Object.keys(User.schema.paths), "Invalid sortBy key."),

    direction: Yup.string().oneOf(["asc", "desc", null], "Invalid direction use 'asc' or 'desc'.").nullable(true),

    showDeleted: Yup.boolean(),

    role: Yup.string().oneOf(Object.values(USER_ROLE), "Invalid role.").nullable(true),

    searchQuery: Yup.string().nullable(true),

    parentId: Yup.string()
      .nullable()
      .test("validId", "Invalid parentId!", (v) => (v === null ? true : isValidObjectId(v))),
  });

  await validationSchema.validate(req.body);

  return req;
}

async function createUserRequest(req) {
  req.body.rate = req.body?.rate ? Number(req.body.rate) : null;
  req.body.creditPoints = req.body?.creditPoints ? Number(req.body.creditPoints) : null;
  req.body.currencyId = req.body?.currencyId || null;
  req.body.username = req.body.username?.trim();
  req.body.password = req.body.password?.trim();

  //User Role extra values
  req.body.isBetLock = req.body?.isBetLock ? req.body.isBetLock : false;
  req.body.forcePasswordChange = req.body?.forcePasswordChange ? req.body.forcePasswordChange : false;
  req.body.exposureLimit = req.body?.exposureLimit ? Number(req.body.exposureLimit) : 0;
  req.body.exposurePercentage = req.body?.exposurePercentage ? Number(req.body.exposurePercentage) : 0;
  req.body.stakeLimit = req.body?.stakeLimit ? Number(req.body.stakeLimit) : 0;
  req.body.maxProfit = req.body?.maxProfit ? Number(req.body.maxProfit) : 0;
  req.body.maxLoss = req.body?.maxLoss ? Number(req.body.maxLoss) : 0;
  req.body.bonus = req.body?.bonus ? Number(req.body.bonus) : 0;
  req.body.maxStake = req.body?.maxStake ? Number(req.body.maxStake) : 0;

  const user = await User.findById(req.user._id, { role: 1 });

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required(),

    username: Yup.string().required(),

    password: Yup.string().required(),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match.")
      .required(),

    rate: Yup.number().min(0).max(100).nullable(true),

    role: Yup.string().oneOf(USER_ACCESSIBLE_ROLES[user.role], "Invalid user role!").required(),

    creditPoints: Yup.number().min(0).nullable(true),

    currencyId: Yup.string().nullable(true),

    city: Yup.string(),

    mobileNumber: Yup.string().length(10).required(),

    isBetLock: Yup.boolean(),

    forcePasswordChange: Yup.boolean(),

    exposureLimit: Yup.number().min(0).nullable(true),

    exposurePercentage: Yup.number().min(0).max(100).nullable(true),

    stakeLimit: Yup.number().min(0).nullable(true),

    maxProfit: Yup.number().min(0).nullable(true),

    maxLoss: Yup.number().min(0).nullable(true),

    bonus: Yup.number().min(0).nullable(true),

    maxStake: Yup.number().min(0).nullable(true),
  });

  await validationSchema.validate(req.body);

  return req;
}

async function updateUserRequest(req) {
  req.body._id = req.body?._id || null;
  req.body.rate = req.body?.rate ? Number(req.body.rate) : null;
  req.body.creditPoints = req.body?.creditPoints ? Number(req.body.creditPoints) : null;
  req.body.password = req.body?.password ? req.body.password.trim() : null;

  const validationSchema = Yup.object().shape({
    _id: Yup.string()
      .required()
      .test("_id", "Given _id is not valid!", (v) => isValidObjectId(v)),

    fullName: Yup.string().required(),

    password: Yup.string().nullable(true),

    confirmPassword: Yup.string()
      .nullable(true)
      .when(["password"], (password, schema) => {
        return password ? schema.oneOf([Yup.ref("password")], "Passwords should match.").required() : schema;
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

async function cloneUserRequest(req) {
  req.body.moduleIds = req.body.moduleIds ? req.body.moduleIds.split(",") : [];
  req.body.username = req.body.username?.trim();
  req.body.password = req.body.password?.trim();

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required(),

    username: Yup.string().required(),

    password: Yup.string().nullable(true),

    confirmPassword: Yup.string()
      .nullable(true)
      .when(["password"], (password, schema) => {
        return password ? schema.oneOf([Yup.ref("password")], "Passwords should match.").required() : schema;
      }),

    moduleIds: Yup.array().required(),

    transactionCode: Yup.string().length(6).required(),
  });

  await validationSchema.validate(req.body);

  return req;
}

export default {
  userListingRequest,
  createUserRequest,
  updateUserRequest,
  fetchUserBalanceRequest,
  cloneUserRequest,
};
