import router, { Router } from "express";
import { EventController } from "../Controllers/EventController";
import { body } from "express-validator";
import {
    authenticateJWT,
    checkIfUserIsVerified,
    checkRevokedToken,
} from "../Middlewares/AuthMiddleware";

const eventRouter: Router = router();
const eventController = new EventController();

eventRouter.get("/categories", eventController.getCategories);
eventRouter.get("/", eventController.getAllEvents);
eventRouter.post(
    "/",
    authenticateJWT,
    checkRevokedToken,
    checkIfUserIsVerified,
    [
        body("name").notEmpty().withMessage("Event name is required"),
        body("description")
            .notEmpty()
            .withMessage("Event description is required")
            .isLength({ max: 500 })
            .withMessage(
                "Event description should be less than 500 characters long",
            ),
        body("category").notEmpty().withMessage("Event category is required"),
        body("visibility")
            .notEmpty()
            .withMessage("Event visibility is required"),
        body("type").notEmpty().withMessage("Event type is required"),
        body("venueType").notEmpty().withMessage("Event venueType is required"),
        body("tags")
            .optional()
            .isArray()
            .withMessage("Event Tags should be an array of strings"),
        body("startDate")
            .notEmpty()
            .toDate()
            .withMessage("Event start date is required"),
        body("endDate")
            .notEmpty()
            .toDate()
            .withMessage("Event end date is required"),
        body("location").notEmpty().withMessage("Event location is required"),
        body("media"),
        body("ticketTypes")
            .notEmpty()
            .withMessage("Event ticket types is required"),
    ],
    eventController.createEvent,
);
eventRouter.get("/:eventId", eventController.getEventById);

eventRouter.patch(
    "/:eventId",
    authenticateJWT,
    checkRevokedToken,
    checkIfUserIsVerified,
    eventController.updateEventById,
);

eventRouter.delete(
    "/:eventId",
    authenticateJWT,
    checkRevokedToken,
    checkIfUserIsVerified,
    eventController.deleteEventById,
);

export default eventRouter;
