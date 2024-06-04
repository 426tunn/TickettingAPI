import router, { Router } from "express";
import { EventController } from "../Controllers/EventController";
import { body } from "express-validator";
import {
    authenticateJWT,
    checkIfUserIsVerified,
    checkRevokedToken,
} from "../Middlewares/AuthMiddleware";
import { EventCategory } from "../Enums/EventCategory";
import { EventVisibility } from "../Enums/EventVisibility";
import { EventType } from "../Enums/EventType";
import { VenueType } from "../Enums/VenueType";

const eventRouter: Router = router();
const eventController = new EventController();

eventRouter.get("/categories", eventController.getCategories);

eventRouter.get("/", eventController.getAllEvents);

eventRouter.get(
    "/organizer-view/",
    authenticateJWT,
    checkRevokedToken,
    checkIfUserIsVerified,
    eventController.getOrganizerEvents,
);

eventRouter.get(
    "/:eventId/organizer-view",
    authenticateJWT,
    checkRevokedToken,
    checkIfUserIsVerified,
    eventController.getEventDetailsById,
);

// FIX: check why unknown category works
eventRouter.post(
    "/",
    authenticateJWT,
    checkRevokedToken,
    [
        body("name").notEmpty().withMessage("Event name is required"),
        body("description")
            .notEmpty()
            .withMessage("Event description is required")
            .isLength({ max: 500 })
            .withMessage(
                "Event description should be less than 500 characters long",
            ),
        body("category")
            .notEmpty()
            .withMessage("Event category is required")
            .toLowerCase()
            .isIn(Object.values(EventCategory))
            .withMessage("Invalid event category"),
        body("visibility")
            .notEmpty()
            .withMessage("Event visibility is required")
            .isIn(Object.values(EventVisibility))
            .withMessage(
                `Invalid event visibility. Valid - ${Object.values(EventVisibility)}`,
            ),
        body("type")
            .notEmpty()
            .withMessage("Event type is required")
            .isIn(Object.values(EventType))
            .withMessage(
                `Invalid event type. Valid - ${Object.values(EventType)}`,
            ),
        body("venueType")
            .notEmpty()
            .withMessage("Event venueType is required")
            .isIn(Object.values(VenueType))
            .withMessage(
                `Invalid event type. Valid - ${Object.values(VenueType)}`,
            ),
        body("tags")
            .optional()
            .isArray()
            .withMessage("Event Tags should be an array of strings"),
        body("startDate")
            .notEmpty()
            .toDate()
            .withMessage("Event start date is required"),
        body("endDate")
            .notEmpty()
            .toDate()
            .withMessage("Event end date is required"),
        body("location").notEmpty().withMessage("Event location is required"),
        body("media"),
        body("ticketTypes")
            .notEmpty()
            .withMessage("Event ticket types is required"),
    ],
    eventController.createEvent,
);

eventRouter.get("/:eventId", eventController.getEventById);

eventRouter.patch(
    "/:eventId",
    authenticateJWT,
    checkRevokedToken,
    checkIfUserIsVerified,
    eventController.updateEventById,
);

// FIX: delete event image when event is deleted
eventRouter.delete(
    "/:eventId",
    authenticateJWT,
    checkRevokedToken,
    checkIfUserIsVerified,
    eventController.deleteEventById,
);

/**
 * @openapi
 * /api/v1/events:
 *   post:
 *     tags:
 *       - Events Management
 *     summary: Create a new event
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the event
 *               description:
 *                 type: string
 *                 description: Description of the event
 *               category:
 *                 type: string
 *                 description: Category of the event
 *               visibility:
 *                 type: string
 *                 description: Visibility of the event
 *               type:
 *                 type: string
 *                 description: Type of the event
 *               venueType:
 *                 type: string
 *                 description: Venue type of the event
 *               tags:
 *                 type: array
 *                 description: Tags of the event
 *               startDate:
 *                 type: string
 *                 description: Start date of the event
 *               endDate:
 *                 type: string
 *                 description: End date of the event
 *               location:
 *                 type: string
 *                 description: Location of the event
 *               media:
 *                 type: array
 *                 description: Media of the event
 *               ticketTypes:
 *                 type: array
 *                 description: Ticket types of the event
 *           example:
 *             name: Art Exhibition Opening
 *             description: Opening night of a new art exhibition featuring local artists
 *             category: Art
 *             visibility: public
 *             type: in-person
 *             venueType: indoor
 *             tags: ["Art", "Opening"]
 *             startDate: "2023-07-15T19:00:00Z"
 *             endDate: "2023-07-15T22:00:00Z"
 *             location: "123 Main St, City, State"
 *             media: []
 *             ticketTypes:
 *               - type: General Admission
 *                 price: 10
 *               - type: VIP
 *                 price: 25
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/events/categories:
 *   get:
 *     tags:
 *       - Events Management
 *     summary: Get all event categories
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Successful get all event categories
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/events:
 *   get:
 *     tags:
 *       - Events Management
 *     summary: Get all events
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Successful get all events
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/events/{eventId}:
 *   get:
 *     tags:
 *       - Events Management
 *     summary: Get an event by id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful get event by id
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/events/{eventId}:
 *   patch:
 *     tags:
 *       - Events Management
 *     summary: Update an event by id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventUpdate:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 *                   status:
 *                     type: string
 *                   visibility:
 *                     type: string
 *                   type:
 *                     type: string
 *                   venueType:
 *                     type: string
 *                   location:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                   media:
 *                     type: array
 *                     items:
 *                       type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   ticketTypes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                         price:
 *                           type: integer
 *     responses:
 *       200:
 *         description: Successful update event by id
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/events/{eventId}:
 *   delete:
 *     tags:
 *       - Events Management
 *     summary: Delete an event by id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Successful delete event by id
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

export default eventRouter;
