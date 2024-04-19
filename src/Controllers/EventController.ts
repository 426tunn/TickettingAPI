import { Request, Response } from "express";
import { EventModel, IEvent } from "../Models/EventModel";
import { EventService } from "../Services/EventService";
import { validationResult } from "express-validator";
import { IUser } from "../Models/UserModel";
import {
    IAuthenticatedRequest,
    IPaginationAndSortReq,
} from "../Types/RequestTypes";
import { UserRole } from "../Enums/UserRole";

export class EventController {
    private eventService: EventService;

    constructor() {
        this.eventService = new EventService(EventModel);
    }

    public getAllEvents = async (
        req: Request & IPaginationAndSortReq,
        res: Response,
    ): Promise<Response<IEvent[] | []>> => {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.perPage) || 9;
            const { sort, order } = req.query;

            let events;
            if (sort === "latest") {
                events = await this.eventService.getAllLatestEvents({
                    order,
                    page,
                    perPage,
                });
            } else if (sort === "popularity") {
                events = await this.eventService.getAllPopularEvents({
                    order,
                    page,
                    perPage,
                });
            } else {
                events = await this.eventService.getAllEvents({
                    page,
                    perPage,
                });
            }

            const totalEvents = await this.eventService.getAllEventsCount();
            const totalNoOfPages = Math.ceil(totalEvents / perPage);
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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const organizerId = req.user._id;
            const eventData = { ...req.body, organizerId };

            const newEvent = await this.eventService.createEvent(eventData);
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
