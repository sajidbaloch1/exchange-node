import mongoose, { isValidObjectId } from "mongoose";
import ErrorResponse from "../../lib/error-handling/error-response.js";
import { encryptPassword } from "../../lib/helpers/auth.js";
import {
    generatePaginationQueries,
    generateSearchFilters,
} from "../../lib/helpers/filters.js";
import Sport from "../../models/v1/Sport.js";
import Competition from "../../models/v1/Competition.js";
import Event from "../../models/v1/Event.js";

/**
 *  Sidebar Sports List
 */
const sportsList = async () => {
    try {
        const allSports = await Sport.find({ isActive: true, isDeleted: false }, { _id: 1, name: 1 });
        let data = [];
        for (var i = 0; i < allSports.length; i++) {
            const getAllCompetition = await Competition.find({ isActive: true, isDeleted: false, sportId: allSports[i]._id }, { _id: 1, name: 1 });
            let competitionEvent = [];
            for (var j = 0; j < getAllCompetition.length; j++) {
                const getAllEvent = await Event.find({ isActive: true, isDeleted: false, competitionId: getAllCompetition[j]._id }, { _id: 1, name: 1 });
                competitionEvent.push({
                    _id: getAllCompetition[j].id,
                    name: getAllCompetition[j].name,
                    event: getAllEvent,
                })
            }
            data.push({
                _id: allSports[i]._id,
                name: allSports[i].name,
                competition: competitionEvent
            })
        }
        return data;
    } catch (e) {
        throw new Error(e);
    }
};

export default {
    sportsList
};