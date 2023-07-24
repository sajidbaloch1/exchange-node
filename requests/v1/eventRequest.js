import { isValidObjectId } from "mongoose";
import Yup from "yup";
import Event from "../../models/v1/Event.js";

async function eventListingRequest(req) {
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
            Object.keys(Event.schema.paths),
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

async function createEventRequest(req) {

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(),
        sportId: Yup.string().required().test("sportId", "Invalid sportId!", isValidObjectId),
        competitionId: Yup.string().required().test("competitionId", "Invalid sportId!", isValidObjectId),
        oddsLimit: Yup.number(),
        volumeLimit: Yup.number(),
        minStackSession: Yup.number(),
        maxStack: Yup.number(),
        maxStackSession: Yup.number(),
    });

    await validationSchema.validate(req.body);

    return req;
}

async function updateEventRequest(req) {
    const validationSchema = Yup.object().shape({
        _id: Yup.string()
            .required()
            .test("_id", "Given _id is not valid!", isValidObjectId),
        name: Yup.string().required(),
        sportId: Yup.string().required().test("sportId", "Invalid sportId!", isValidObjectId),
        competitionId: Yup.string().required().test("competitionId", "Invalid sportId!", isValidObjectId),
        oddsLimit: Yup.number(),
        volumeLimit: Yup.number(),
        minStack: Yup.number(),
        minStackSession: Yup.number(),
        maxStack: Yup.number(),
        maxStackSession: Yup.number(),
        betDeleted: Yup.boolean(),
        hardBetDeleted: Yup.boolean(),
        completed: Yup.boolean(),
        isActive: Yup.boolean()
    });

    await validationSchema.validate(req.body);

    return req;
}

export default {
    eventListingRequest,
    createEventRequest,
    updateEventRequest,
};