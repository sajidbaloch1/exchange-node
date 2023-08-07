import { isValidObjectId } from "mongoose";
import Yup from "yup";

async function createBetRequest(req) {
    const validationSchema = Yup.object().shape({
        userId: Yup.string().required()
            .test("userId", "Invalid userId!", (v) => !v || isValidObjectId),
        marketId: Yup.string().required()
            .test("marketId", "Invalid marketId!", (v) => !v || isValidObjectId),
        eventId: Yup.string().required()
            .test("eventId", "Invalid eventId!", (v) => !v || isValidObjectId),
        odds: Yup.number().required(),
        stake: Yup.number().required(),
        isBack: Yup.boolean().required(),
        betOrderType: Yup.string().required(),
        betOrderStatus: Yup.string().required(),
        betResultStatus: Yup.string().required(),
        betPl: Yup.number().required(),
        deviceInfo: Yup.string().required(),
        ipAddress: Yup.string().required(),
    });

    await validationSchema.validate(req.body);

    return req;
}

export default {
    createBetRequest
};