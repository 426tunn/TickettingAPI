import router, { Router } from "express";
import { TicketController } from "../Controllers/TicketController";
import { body } from "express-validator";
import { authenticateJWT } from "../Middlewares/AuthMiddleware";
import { isValidMongooseIdMiddleware } from "../Middlewares/mongooseCustomMiddleware";
import { isValidMongooseIdValidator } from "../Utils/validatorUtils";

const ticketRouter: Router = router();
const ticketController = new TicketController();

ticketRouter.get("/", ticketController.getAllTickets);

ticketRouter.post(
    "/",
    authenticateJWT,
    [
        body("eventTicketTypeId")
            .notEmpty()
            .withMessage("Event Ticket Type is required")
            .custom(isValidMongooseIdValidator("Event Ticket")),
        body("userId")
            .notEmpty()
            .withMessage("User is required")
            .custom(isValidMongooseIdValidator("User")),
        body("eventId")
            .notEmpty()
            .withMessage("Event is required")
            .custom(isValidMongooseIdValidator("Event")),
    ],
    ticketController.createTicket,
);

ticketRouter.get(
    "/:ticketId",
    isValidMongooseIdMiddleware,
    ticketController.getTicketById,
);

ticketRouter.get(
    "/events/:eventId",
    isValidMongooseIdMiddleware,
    ticketController.getEventTickets,
);

ticketRouter.get(
    "/events/:eventId/users/:userId",
    isValidMongooseIdMiddleware,
    ticketController.getUserEventTicket,
);

ticketRouter.patch(
    "/:ticketId",
    isValidMongooseIdMiddleware,
    ticketController.updateTicketById,
);

ticketRouter.patch(
    "/:ticketId/events/:eventId/users/:userId",
    isValidMongooseIdMiddleware,
    ticketController.updateTicketByEventIdAndUserId,
);

ticketRouter.delete(
    "/:ticketId",
    isValidMongooseIdMiddleware,
    ticketController.deleteTicketById,
);

ticketRouter.delete(
    "/:ticketId/events/:eventId/users/:userId",
    isValidMongooseIdMiddleware,
    ticketController.deleteTicketByEventIdAndUserId,
);

export default ticketRouter;
