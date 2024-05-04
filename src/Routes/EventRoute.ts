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

eventRouter.get("/", eventController.getAllEvents);
eventRouter.post(
    "/",
    authenticateJWT,
    checkIfUserIsAdmin,
    [
        body("name").notEmpty().withMessage("Event name is required"),
        body("description")
            .notEmpty()
            .withMessage("Event description is required"),
        body("status").notEmpty().withMessage("Event status is required"),
        body("visibility")
            .notEmpty()
            .withMessage("Event visibility is required"),
        body("type").notEmpty().withMessage("Event type is required"),
        body("venue").notEmpty().withMessage("Event venue is required"),
        body("location").notEmpty().withMessage("Event location is required"),
        body("startDate")
            .notEmpty()
            .isDate()
            .withMessage("Event start date is required"),
        body("endDate")
            .notEmpty()
            .isDate()
            .withMessage("Event end date is required"),
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
