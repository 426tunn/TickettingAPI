import router, { type Router } from "express";
import AdminController from "../Controllers/AdminController";
import { EventService } from "../Services/EventService";
import { EventModel } from "../Models/EventModel";
import { isValidMongooseIdMiddleware } from "../Middlewares/mongooseCustomMiddleware";
import { body } from "express-validator";
import { EventStatus } from "../Enums/EventStatus";
import { EventController } from "../Controllers/EventController";
import { VenueType } from "../Enums/VenueType";
import { EventVisibility } from "../Enums/EventVisibility";
import { EventCategory } from "../Enums/EventCategory";

const adminRouter: Router = router();

const eventService = new EventService(EventModel);
const adminController = new AdminController(eventService);
const eventController = new EventController();

adminRouter.get("/events", adminController.getAllEvents);
adminRouter.get(
    "/event-detail/:eventId",
    isValidMongooseIdMiddleware,
    eventController.getEventDetailsById,
);
adminRouter.patch(
    "/events/:eventId",
    isValidMongooseIdMiddleware,
    [
        body("name").optional(),
        body("description")
            .optional()
            .isLength({ max: 1000 })
            .withMessage(
                "Event description should be less than 1000 characters long",
            ),
        body("category")
            .optional()
            .toLowerCase()
            .isIn(Object.values(EventCategory))
            .withMessage("Invalid event category"),
        body("visibility")
            .optional()
            .toLowerCase()
            .isIn(Object.values(EventVisibility))
            .withMessage(
                `Invalid event visibility. Valid - ${Object.values(EventVisibility)}`,
            ),
        body("venueType")
            .optional()
            .toLowerCase()
            .isIn(Object.values(VenueType))
            .withMessage(
                `Invalid event type. Valid - ${Object.values(VenueType)}`,
            ),
        body("tags")
            .optional()
            .isArray()
            .withMessage("Event Tags should be an array of strings"),
        body("startDate")
            .optional()
            .custom(async (value) => {
                if (isNaN(Date.parse(value))) {
                    throw new Error("Invalid start date");
                }
            })
            .toDate(),
        body("endDate")
            .optional()
            .custom(async (value) => {
                if (isNaN(Date.parse(value))) {
                    throw new Error("Invalid end date");
                }
            })
            .toDate(),
        body("location").optional(),
        body("media").optional(),
    ],
    eventController.updateEventById,
);

adminRouter.get("/events/deleted", adminController.getDeletedEvents);
adminRouter.patch(
    "/event/status/:eventId",
    isValidMongooseIdMiddleware,
    body("status")
        .notEmpty()
        .withMessage("Status update is required")
        .toLowerCase()
        .isIn(Object.values(EventStatus))
        .withMessage(
            `Invalid event status. Valid statuses are - ${Object.values(EventStatus)}`,
        ),
    adminController.updateEventStatus,
);

export default adminRouter;
