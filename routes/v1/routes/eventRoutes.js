import express from "express";
import eventController from "../../../controllers/v1/eventController.js";
import { route } from "../../../lib/error-handling/routes-error-boundary.js";

const router = express.Router();

route(router, "post", "/getAllEvent", eventController.getAllEvent);
route(router, "post", "/getEventById", eventController.getEventById);
route(router, "post", "/createEvent", eventController.createEvent);
route(router, "post", "/updateEvent", eventController.updateEvent);
route(router, "post", "/deleteEvent", eventController.deleteEvent);

export default router;
