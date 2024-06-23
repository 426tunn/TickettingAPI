import router, { type Router } from "express";
import AdminController from "../Controllers/AdminController";
import { EventService } from "../Services/EventService";
import { EventModel } from "../Models/EventModel";
import { isValidMongooseIdMiddleware } from "../Middlewares/mongooseCustomMiddleware";
import { body } from "express-validator";
import { EventStatus } from "../Enums/EventStatus";

const adminRouter: Router = router();

const eventService = new EventService(EventModel);
const adminController = new AdminController(eventService);

adminRouter.get("/events", adminController.getAllEvents);

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
