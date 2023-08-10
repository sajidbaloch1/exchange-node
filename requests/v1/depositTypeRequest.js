import { isValidObjectId } from "mongoose";
import Yup from "yup";
import { isValidTime } from "../../lib/helpers/validation.js";
import DepositType from "../../models/v1/DepositType.js";

async function depositTypeListingRequest(req) {
  req.body.page = req.body?.page ? Number(req.body.page) : null;
  req.body.perPage = req.body?.perPage ? Number(req.body.perPage) : 10;
  req.body.sortBy = req.body?.sortBy ? req.body.sortBy : "isActive";
  req.body.direction = req.body?.direction ? req.body.direction : "asc";
  req.body.searchQuery = req.body?.searchQuery ? req.body.searchQuery?.trim() : null;
  req.body.showDeleted = req.body?.showDeleted ? [true, "true"].includes(req.body.showDeleted) : false;
  req.body.showRecord = req.body?.showRecord ? req.body.showRecord?.trim() : "All";

  const validationSchema = Yup.object().shape({
    page: Yup.number().nullable(true),

    perPage: Yup.number(),

    sortBy: Yup.string().oneOf(Object.keys(DepositType.schema.paths), "Invalid sortBy key."),

    showDeleted: Yup.boolean(),

    showRecord: Yup.string(),

    direction: Yup.string().oneOf(["asc", "desc", null], "Invalid direction use 'asc' or 'desc'.").nullable(true),

    searchQuery: Yup.string().nullable(true),

  });

  await validationSchema.validate(req.body);

  return req;
}

async function createDepositTypeRequest(req) {
  const validationSchema = Yup.object().shape({
    userId: Yup.string().required().test("userId", "Invalid userId!", isValidObjectId),
    type: Yup.string().required(),
    name: Yup.string().required(),
    minAmount: Yup.number().required(),
    maxAmount: Yup.number().required(),
    mobileNumber: Yup.string().nullable(true),
    description: Yup.string().nullable(true),
    accountHolderName: Yup.string().nullable(true),
    bankName: Yup.string().nullable(true),
    accountNumber: Yup.string().nullable(true),
    accountType: Yup.string().nullable(true),
    ifsc: Yup.string().nullable(true),
    platformName: Yup.string().nullable(true),
    platformDisplayName: Yup.string().nullable(true),
    platformAddress: Yup.string().nullable(true),
    depositLink: Yup.string().nullable(true),
  });

  await validationSchema.validate(req.body);

  return req;
}

async function updateDepositTypeRequest(req) {
  const validationSchema = Yup.object().shape({
    _id: Yup.string().required().test("_id", "Given _id is not valid!", isValidObjectId),
    userId: Yup.string().required().test("userId", "Invalid userId!", isValidObjectId),
    type: Yup.string().required(),
    name: Yup.string().required(),
    minAmount: Yup.number().required(),
    maxAmount: Yup.number().required(),
    mobileNumber: Yup.string().nullable(true),
    description: Yup.string().nullable(true),
    accountHolderName: Yup.string().nullable(true),
    bankName: Yup.string().nullable(true),
    accountNumber: Yup.string().nullable(true),
    accountType: Yup.string().nullable(true),
    ifsc: Yup.string().nullable(true),
    platformName: Yup.string().nullable(true),
    platformDisplayName: Yup.string().nullable(true),
    platformAddress: Yup.string().nullable(true),
    depositLink: Yup.string().nullable(true),
    isActive: Yup.boolean().nullable(true)
  });

  await validationSchema.validate(req.body);

  return req;
}

export default {
  depositTypeListingRequest,
  createDepositTypeRequest,
  updateDepositTypeRequest,
};
