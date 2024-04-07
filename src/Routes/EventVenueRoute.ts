import router, { Router } from "express";
import { EventVenueController } from "../Controllers/EventVenueController";
import { body } from "express-validator";
import {
    authenticateJWT,
    checkIfUserIsAdmin,
} from "../Middlewares/AuthMiddleware";

const eventVenueRouter: Router = router();
const eventVenueController = new EventVenueController();

eventVenueRouter.get(
    "/",
    authenticateJWT,
    checkIfUserIsAdmin,
    eventVenueController.getAllEventVenues,
);
eventVenueRouter.post(
    "/",
    [
        body("country").notEmpty().withMessage("Event country is required"),
        body("city").notEmpty().withMessage("Event city is required"),
        body("state").notEmpty().withMessage("Event state is required"),
        body("street").notEmpty().withMessage("Event street is required"),
        body("building").notEmpty().withMessage("Event building is required"),
    ],
    eventVenueController.createEventVenue,
);
eventVenueRouter.get("/:eventVenueId", eventVenueController.getEventVenueById);
eventVenueRouter.patch(
    "/:eventVenueId",
    eventVenueController.updateEventVenueById,
);
eventVenueRouter.delete(
    "/:eventVenueId",
    eventVenueController.deleteEventVenueById,
);

export default eventVenueRouter;
