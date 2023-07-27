import { isValidObjectId } from "mongoose";
import Yup from "yup";
import Transaction from "../../models/v1/Transaction.js";

async function transactionActivityListingRequest(req) {
  req.body.page = req.body?.page ? Number(req.body.page) : null;
  req.body.perPage = req.body?.perPage ? Number(req.body.perPage) : 10;
  req.body.sortBy = req.body?.sortBy ? req.body.sortBy : "createdAt";
  req.body.direction = req.body?.direction ? req.body.direction : "desc";
  req.body.searchQuery = req.body?.searchQuery
    ? req.body.searchQuery?.trim()
    : null;
  req.body.fromDate = req.body?.fromDate
    ? req.body.fromDate
    : null;
  req.body.toDate = req.body?.toDate
    ? req.body.toDate
    : null;
  req.body.userId = req.body?.userId
    ? req.body.userId?.trim()
    : null;

  const validationSchema = Yup.object().shape({
    page: Yup.number().nullable(true),
    perPage: Yup.number(),
    sortBy: Yup.string().oneOf(
      Object.keys(Transaction.schema.paths),
      "Invalid sortBy key."
    ),
    direction: Yup.string()
      .oneOf(["asc", "desc", null], "Invalid direction use 'asc' or 'desc'.")
      .nullable(true),
    searchQuery: Yup.string().nullable(true),
    fromDate: Yup.date().nullable(true),
    toDate: Yup.date().nullable(true),
    userId: Yup.string().required().test("userId", "Given userId is not valid!", isValidObjectId),
  });

  await validationSchema.validate(req.body);

  return req;
}

async function createTransactionRequest(req) {

  const validationSchema = Yup.object().shape({
    userId: Yup.string().required().test("userId", "Given userId is not valid!", isValidObjectId),
    fromId: Yup.string().required().test("fromId", "Given userId is not valid!", isValidObjectId),
    points: Yup.number().required(),
    type: Yup.string().required(),
    remark: Yup.string().required(),
  });

  await validationSchema.validate(req.body);

  return req;
}

export default {
  transactionActivityListingRequest,
  createTransactionRequest
};
