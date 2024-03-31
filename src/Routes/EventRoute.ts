import router, { Router } from "express";
import { EventController } from "../Controllers/EventController";
import { body } from "express-validator";
import { isAdminMiddleware } from "../Middlewares/AuthMiddleware";

const eventRouter: Router = router();
const eventController = new EventController();

eventRouter.get("/", eventController.getAllEvents);
eventRouter.post(
    "/",
    isAdminMiddleware,
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
        body("tickets").notEmpty().withMessage("Event tickets is required"),
        body("startDate")
            .notEmpty()
            .isDate()
            .withMessage("Event start date is required"),
        body("endDate")
            .notEmpty()
            .isDate()
            .withMessage("Event end date is required"),
        body("totalTickets")
            .notEmpty()
            .withMessage("Event total Tickets is required"),
    ],
    eventController.createEvent,
);
eventRouter.get("/:eventId", eventController.getEventById);
eventRouter.patch(
    "/:eventId", isAdminMiddleware, eventController.updateEventById
);
eventRouter.delete(
    "/:eventId", isAdminMiddleware, eventController.deleteEventById
);

export default eventRouter;
