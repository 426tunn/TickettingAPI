import router, { Router } from "express";
import {
    EventTicketTypeController
} from "../Controllers/EventTicketTypeController";
import { body } from "express-validator";
import {
    authenticateJWT,
    checkIfUserIsAdmin,
    checkIfUserIsSuperAdmin,
    checkRevokedToken,
} from "../Middlewares/AuthMiddleware";

const eventTicketTypeRouter: Router = router();
const eventTicketTypeController = new EventTicketTypeController();

eventTicketTypeRouter.get("/", eventTicketTypeController.getAllEventTicketTypes);
eventTicketTypeRouter.post(
    "/",
    checkIfUserIsAdmin,
    [
        body("name").notEmpty().withMessage("Ticket type name is required"),
        body("price").notEmpty().withMessage("Ticket type price is required"),
        body("noOfTickets").notEmpty().withMessage(
            "No of tickets is required"
        ),
    ],
    eventTicketTypeController.createEventTicketType,
);

eventTicketTypeRouter.get(
    "/:eventTicketTypeId",
    eventTicketTypeController.getEventTicketTypeById
);

eventTicketTypeRouter.patch(
    "/:eventTicketTypeId",
    authenticateJWT,
    checkIfUserIsSuperAdmin,
    checkRevokedToken,
    eventTicketTypeController.updateEventTicketTypeById,
);

eventTicketTypeRouter.delete(
    "/:eventTicketTypeId",
    authenticateJWT,
    checkIfUserIsSuperAdmin,
    checkRevokedToken,
    eventTicketTypeController.deleteEventTicketTypeById,
);

export default eventTicketTypeRouter;

