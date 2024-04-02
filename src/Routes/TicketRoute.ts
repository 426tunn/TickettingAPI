// TODO: make naming convention for req body same as model attributes for all routes
import router, { Router } from "express";
import { TicketController } from "../Controllers/TicketController";
import { body } from "express-validator";
import { authenticateJWT } from "../Middlewares/AuthMiddleware";

const ticketRouter: Router = router();
const ticketController = new TicketController();

ticketRouter.get("/", ticketController.getAllTickets);

ticketRouter.post(
    "/",
    authenticateJWT,
    [
        body("eventTicketTypeId").notEmpty().withMessage(
            "Event Ticket Type is required"),
        body("userId").notEmpty().withMessage("User is required"),
        body("eventId").notEmpty().withMessage("Event is required"),
    ],
    ticketController.createTicket,
);

ticketRouter.get("/:ticketId", ticketController.getTicketById);

ticketRouter.get("/events/:eventId", ticketController.getEventTickets);

ticketRouter.get(
    "/events/:eventId/users/:userId", ticketController.getUserEventTicket
);

ticketRouter.patch("/:ticketId", ticketController.updateTicketById);

ticketRouter.patch(
    "/:ticketId/events/:eventId/users/:userId",
    ticketController.updateTicketByEventIdAndUserId
);

ticketRouter.delete("/:ticketId", ticketController.deleteTicketById);

ticketRouter.delete(
    "/:ticketId/events/:eventId/users/:userId",
    ticketController.deleteTicketByEventIdAndUserId
);


export default ticketRouter;
