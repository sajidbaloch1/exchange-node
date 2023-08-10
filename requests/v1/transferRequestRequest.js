import { isValidObjectId } from "mongoose";
import Yup from "yup";
import { isValidTime } from "../../lib/helpers/validation.js";
import TransferRequest from "../../models/v1/TransferRequest.js";

async function transferRequestListingRequest(req) {
  req.body.page = req.body?.page ? Number(req.body.page) : null;
  req.body.perPage = req.body?.perPage ? Number(req.body.perPage) : 10;
  req.body.sortBy = req.body?.sortBy ? req.body.sortBy : "isActive";
  req.body.direction = req.body?.direction ? req.body.direction : "asc";
  req.body.searchQuery = req.body?.searchQuery ? req.body.searchQuery?.trim() : null;
  req.body.showDeleted = req.body?.showDeleted ? [true, "true"].includes(req.body.showDeleted) : false;
  req.body.showRecord = req.body?.showRecord ? req.body.showRecord?.trim() : "All";
  req.body.userId = req.body?.userId ? req.body.userId?.trim() : null;

  const validationSchema = Yup.object().shape({
    page: Yup.number().nullable(true),

    perPage: Yup.number(),

    sortBy: Yup.string().oneOf(Object.keys(TransferRequest.schema.paths), "Invalid sortBy key."),

    showDeleted: Yup.boolean(),

    showRecord: Yup.string(),

    direction: Yup.string().oneOf(["asc", "desc", null], "Invalid direction use 'asc' or 'desc'.").nullable(true),

    searchQuery: Yup.string().nullable(true),
    userId: Yup.string().nullable(true),

  });

  await validationSchema.validate(req.body);

  return req;
}

async function createTransferRequestRequest(req) {
  const validationSchema = Yup.object().shape({
    userId: Yup.string().required().test("userId", "Invalid userId!", isValidObjectId),
    transferTypeId: Yup.string().required().test("transferTypeId", "Invalid transferTypeId!", isValidObjectId),
    withdrawGroupId: Yup.string().nullable(true),
    amount: Yup.number().required(),
    status: Yup.string().nullable(true),
    message: Yup.string().nullable(true),
  });

  await validationSchema.validate(req.body);

  return req;
}

async function updateTransferRequestRequest(req) {
  const validationSchema = Yup.object().shape({
    _id: Yup.string().required().test("_id", "Given _id is not valid!", isValidObjectId),
    userId: Yup.string().required().test("userId", "Invalid userId!", isValidObjectId),
    transferTypeId: Yup.string().required().test("transferTypeId", "Invalid transferTypeId!", isValidObjectId),
    withdrawGroupId: Yup.string().nullable(true),
    amount: Yup.number().required(),
    status: Yup.string().nullable(true),
    message: Yup.string().nullable(true),
  });

  await validationSchema.validate(req.body);

  return req;
}

export default {
  transferRequestListingRequest,
  createTransferRequestRequest,
  updateTransferRequestRequest,
};
