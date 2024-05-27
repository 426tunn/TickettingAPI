import router, { Router } from "express";
import { EventTicketTypeController } from "../Controllers/EventTicketTypeController";
import { body } from "express-validator";
import {
    authenticateJWT,
    checkIfUserIsVerified,
    checkRevokedToken,
} from "../Middlewares/AuthMiddleware";

const eventTicketTypeRouter: Router = router();
const eventTicketTypeController = new EventTicketTypeController();

eventTicketTypeRouter.get(
    "/",
    eventTicketTypeController.getAllEventTicketTypes,
);
eventTicketTypeRouter.post(
    "/",
    authenticateJWT,
    checkRevokedToken,
    checkIfUserIsVerified,
    [
        body("name").notEmpty().withMessage("Ticket type name is required"),
        body("price").notEmpty().withMessage("Ticket type price is required"),
        body("quantity").notEmpty().withMessage("No of tickets is required"),
    ],
    eventTicketTypeController.createEventTicketType,
);

eventTicketTypeRouter.get(
    "/:eventTicketTypeId",
    eventTicketTypeController.getEventTicketTypeById,
);

eventTicketTypeRouter.get(
    "/events/:eventId",
    eventTicketTypeController.getTicketTypesByEventId,
);

eventTicketTypeRouter.patch(
    "/:eventTicketTypeId",
    authenticateJWT,
    checkRevokedToken,
    checkIfUserIsVerified,
    eventTicketTypeController.updateEventTicketTypeById,
);

eventTicketTypeRouter.delete(
    "/:eventTicketTypeId",
    authenticateJWT,
    checkRevokedToken,
    checkIfUserIsVerified,
    eventTicketTypeController.deleteEventTicketTypeById,
);

export default eventTicketTypeRouter;
