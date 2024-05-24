import { Request, Response } from "express";
import { EventModel, IEvent } from "../Models/EventModel";
import { EventService } from "../Services/EventService";
import { validationResult } from "express-validator";
import { IUser } from "../Models/UserModel";
import {
    IAuthenticatedRequest,
    IEventPaginationAndSortReq,
} from "../Types/RequestTypes";
import { UserRole } from "../Enums/UserRole";
import { EventCategory } from "../Enums/EventCategory";
import { EventTicketTypeService } from "../Services/EventTicketTypeService";
import { EventTicketTypeModel } from "../Models/EventTicketTypeModel";

export class EventController {
    private eventService: EventService;
    private ticketTypeService: EventTicketTypeService;

    constructor() {
        this.eventService = new EventService(EventModel);
        this.ticketTypeService = new EventTicketTypeService(
            EventTicketTypeModel,
        );
    }

    public getCategories = async (req: Request, res: Response) => {
        try {
            return res
                .status(200)
                .json({ eventCategories: Object.keys(EventCategory) });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public getAllEvents = async (
        req: Request & IEventPaginationAndSortReq,
        res: Response,
    ): Promise<Response<IEvent[] | []>> => {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.perPage) || 9;
            const { sort, order } = req.query;

            const events = await this.eventService.getAllEvents({
                sort,
                order,
                page,
                perPage,
            });

            const totalNoOfPages = Math.ceil(events.length / perPage);
            return res
                .status(200)
                .json({ page, perPage, totalNoOfPages, events });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public createEvent = async (
        req: IAuthenticatedRequest<IUser>,
        res: Response,
    ): Promise<Response<IEvent>> => {
        try {
            if (!req.user.isVerified) {
                return res
                    .status(403)
                    .json({ error: "User email not verified" });
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const organizerId = req.user._id;
            const eventData = { ...req.body, organizerId };
            const ticketTypes = eventData.ticketTypes;

            const newEvent = await this.eventService.createEvent(eventData);
            await this.ticketTypeService.createEventTicketTypes(
                ticketTypes,
                newEvent._id,
            );
            res.status(201).json({ event: newEvent });
        } catch (error) {
            res.status(500).json(error);
        }
    };

    public getEventById = async (
        req: Request,
        res: Response,
    ): Promise<Response<IEvent | null>> => {
        try {
            const eventId = req.params.eventId;
            const event = await this.eventService.getEventById(eventId);
            if (event == null) {
                return res.status(404).json({ error: "Event does not exists" });
            }
            return res.status(200).json(event);
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public updateEventById = async (
        req: IAuthenticatedRequest<IUser>,
        res: Response,
    ): Promise<Response<Event | null>> => {
        try {
            const eventId = req.params.eventId;

            const event = await this.eventService.getEventById(eventId);
            if (event == null) {
                return res.status(404).json({ error: "Event does not exists" });
            }

            if (
                req.user.id !== event.organizerId ||
                req.user.role !== UserRole.SuperAdmin
            ) {
                return res.status(403).json({
                    error: "Only the event organizers and admins can update the event",
                });
            }

            const eventUpdate = req.body;
            const updatedEvent = await this.eventService.updateEventById(
                eventId,
                eventUpdate,
            );
            return res.status(200).json({ event: updatedEvent });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public deleteEventById = async (
        req: Request,
        res: Response,
    ): Promise<Response<null>> => {
        try {
            const eventId = req.params.eventId;
            const event = await this.eventService.getEventById(eventId);
            if (event == null) {
                return res.status(404).json({ error: "Event does not exists" });
            }
            await this.eventService.deleteEventById(eventId);
            return res.status(204).json();
        } catch (error) {
            return res.status(500).json(error);
        }
    };
}
