import router, { Router } from "express";
import { EventController } from "../Controllers/EventController";
import { body } from "express-validator";
import {
    authenticateJWT,
    checkIfUserIsAdmin,
    checkIfUserIsSuperAdmin,
    checkRevokedToken,
} from "../Middlewares/AuthMiddleware";

const eventRouter: Router = router();
const eventController = new EventController();

eventRouter.get("/categories", eventController.getCategories);
eventRouter.get("/", eventController.getAllEvents);
eventRouter.post(
    "/",
    authenticateJWT,
    [
        body("name").notEmpty().withMessage("Event name is required"),
        body("description")
            .notEmpty()
            .withMessage("Event description is required"),
        body("category").notEmpty().withMessage("Event category is required"),
        body("status").notEmpty().withMessage("Event status is required"),
        body("visibility")
            .notEmpty()
            .withMessage("Event visibility is required"),
        body("type").notEmpty().withMessage("Event type is required"),
        body("location").notEmpty().withMessage("Event location is required"),
        body("venueType").notEmpty().withMessage("Event venueType is required"),
        body("startDate")
            .notEmpty()
            .toDate()
            .withMessage("Event start date is required"),
        body("endDate")
            .notEmpty()
            .toDate()
            .withMessage("Event end date is required"),
        body("tags")
            .optional()
            .isArray()
            .withMessage("Event Tags should be an array of strings"),
    ],
    eventController.createEvent,
);
eventRouter.get("/:eventId", eventController.getEventById);
eventRouter.patch(
    "/:eventId",
    authenticateJWT,
    checkIfUserIsAdmin,
    checkRevokedToken,
    eventController.updateEventById,
);
eventRouter.delete(
    "/:eventId",
    authenticateJWT,
    checkIfUserIsSuperAdmin,
    checkRevokedToken,
    eventController.deleteEventById,
);

export default eventRouter;
