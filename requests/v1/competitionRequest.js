import { isValidObjectId } from "mongoose";
import Yup from "yup";
import Competition from "../../models/v1/Competition.js";

async function competitionListingRequest(req) {
    req.body.page = req.body?.page ? Number(req.body.page) : null;
    req.body.perPage = req.body?.perPage ? Number(req.body.perPage) : 10;
    req.body.sortBy = req.body?.sortBy ? req.body.sortBy : "createdAt";
    req.body.direction = req.body?.direction ? req.body.direction : "desc";
    req.body.searchQuery = req.body?.searchQuery
        ? req.body.searchQuery?.trim()
        : null;
    req.body.showDeleted = req.body?.showDeleted
        ? [true, "true"].includes(req.body.showDeleted)
        : false;
    req.body.showRecord = req.body?.showRecord
        ? req.body.showRecord?.trim()
        : 'All';

    const validationSchema = Yup.object().shape({
        page: Yup.number().nullable(true),

        perPage: Yup.number(),

        sortBy: Yup.string().oneOf(
            Object.keys(Competition.schema.paths),
            "Invalid sortBy key."
        ),
        showDeleted: Yup.boolean(),
        showRecord: Yup.string(),
        direction: Yup.string()
            .oneOf(["asc", "desc", null], "Invalid direction use 'asc' or 'desc'.")
            .nullable(true),

        searchQuery: Yup.string().nullable(true),
    });

    await validationSchema.validate(req.body);

    return req;
}

async function createCompetitionRequest(req) {

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(),
        sportId: Yup.string().required(),
    });

    await validationSchema.validate(req.body);

    return req;
}

async function updateCompetitionRequest(req) {
    const validationSchema = Yup.object().shape({
        _id: Yup.string()
            .required()
            .test("_id", "Given _id is not valid!", isValidObjectId),
        name: Yup.string().required(),
        sportId: Yup.string().required().test("sportId", "Invalid sportId!", isValidObjectId),
    });

    await validationSchema.validate(req.body);

    return req;
}

export default {
    competitionListingRequest,
    createCompetitionRequest,
    updateCompetitionRequest,
};