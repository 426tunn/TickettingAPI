import router, { Router } from "express";
import { EventTicketTypeController } from "../Controllers/EventTicketTypeController";
import { body } from "express-validator";
import {
    authenticateJWT,
    checkIfUserIsVerified,
    checkRevokedToken,
} from "../Middlewares/AuthMiddleware";
import { isValidMongooseIdMiddleware } from "../Middlewares/mongooseCustomMiddleware";

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
        body("price")
            .notEmpty()
            .withMessage("Ticket type price is required")
            .custom(async (value) => {
                if (parseFloat(value).toString().split(".")[1].length > 2) {
                    throw new Error(
                        "Ticket type should be a maximum of 2 decimal points",
                    );
                }
            }),
        body("quantity").notEmpty().withMessage("No of tickets is required"),
    ],
    eventTicketTypeController.createEventTicketType,
);

eventTicketTypeRouter.get(
    "/:eventTicketTypeId",
    isValidMongooseIdMiddleware,
    eventTicketTypeController.getEventTicketTypeById,
);

eventTicketTypeRouter.get(
    "/events/:eventId",
    isValidMongooseIdMiddleware,
    eventTicketTypeController.getTicketTypesByEventId,
);

eventTicketTypeRouter.patch(
    "/:eventTicketTypeId",
    authenticateJWT,
    checkRevokedToken,
    checkIfUserIsVerified,
    isValidMongooseIdMiddleware,
    eventTicketTypeController.updateEventTicketTypeById,
);

eventTicketTypeRouter.delete(
    "/:eventTicketTypeId",
    authenticateJWT,
    checkRevokedToken,
    checkIfUserIsVerified,
    isValidMongooseIdMiddleware,
    eventTicketTypeController.deleteEventTicketTypeById,
);

/**
 * @openapi
 * /api/v1/ticket-types:
 *    get:
 *      tags:
 *        - Ticket Types Management
 *      summary: Get all ticket types
 *      security: [{ bearerAuth: [] }]
 *      responses:
 *        200:
 *         description: Successful get all ticket types
 *        401:
 *         description: Unauthorized
 *        500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/ticket-types/:eventTicketTypeId:
 *    get:
 *      tags:
 *        - Ticket Types Management
 *      summary: Get a ticket type by Id
 *      security: [{ bearerAuth: [] }]
 *      parameters:
 *        - in: path
 *          name: eventTicketTypeId
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *         description: Successful get a ticket type by id
 *        401:
 *         description: Unauthorized
 *        403:
 *         description: Forbidden
 *        404:
 *         description: Ticket type not found
 *        500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/events/{eventId}/ticket-types:
 *   get:
 *     tags:
 *       - Ticket Types Management
 *     summary: Get ticket types for an event by id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful get ticket types for an event by id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event or ticket types not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/ticket-types/{eventTicketTypeId}:
 *   patch:
 *     tags:
 *       - Ticket Types Management
 *     summary: Update a ticket type by id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: eventTicketTypeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                 price:
 *                   type: integer
 *               example:
 *                 type: General Admission
 *                 price: 10
 *     responses:
 *       200:
 *         description: Successful update ticket type by id
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Ticket type not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/ticket-types/{eventTicketTypeId}:
 *   delete:
 *     tags:
 *       - Ticket Types Management
 *     summary: Delete a ticket type by id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: eventTicketTypeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Successful delete ticket type by id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Ticket type not found
 *       500:
 *         description: Internal server error
 */

export default eventTicketTypeRouter;
