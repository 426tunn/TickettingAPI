import { Request, Response } from "express";
import {
    EventTicketTypeModel,
    IEventTicketType,
} from "../Models/EventTicketTypeModel";
import { EventTicketTypeService } from "../Services/EventTicketTypeService";
import { validationResult } from "express-validator";
import { EventService } from "../Services/EventService";
import { EventModel, IEvent } from "../Models/EventModel";
import { IAuthenticatedRequest } from "../Types/RequestTypes";
import { IUser } from "../Models/UserModel";

export class EventTicketTypeController {
    private eventTicketTypeService: EventTicketTypeService;
    private eventService: EventService;

    constructor() {
        this.eventTicketTypeService = new EventTicketTypeService(
            EventTicketTypeModel,
        );
        this.eventService = new EventService(EventModel);
    }

    public getAllEventTicketTypes = async (
        _req: Request,
        res: Response,
    ): Promise<Response<IEventTicketType[] | []>> => {
        try {
            const ticketTypes =
                await this.eventTicketTypeService.getAllEventTicketTypes();
            return res.status(200).json({ ticketTypes });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public createEventTicketType = async (
        req: Request,
        res: Response,
    ): Promise<Response<IEventTicketType>> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const newEventTicketType =
                await this.eventTicketTypeService.createEventTicketType(
                    req.body,
                );
            return res
                .status(201)
                .json({ eventTicketType: newEventTicketType });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public getTicketTypesByEventId = async (
        req: Request,
        res: Response,
    ): Promise<Response<IEvent | null>> => {
        const { eventId } = req.params;
        const event = await this.eventService.getEventById(eventId);
        if (event == null) {
            return res.status(404).json({ error: "Event not found" });
        }

        const ticketTypes =
            await this.eventTicketTypeService.getTicketTypesByEventId(eventId);
        return res.status(200).json(ticketTypes);
    };

    public getEventTicketTypeById = async (
        req: Request,
        res: Response,
    ): Promise<Response<IEventTicketType | null>> => {
        try {
            const eventTicketTypeId = req.params.eventTicketTypeId;
            const eventTicketType =
                await this.eventTicketTypeService.getEventTicketTypeById(
                    eventTicketTypeId,
                );
            if (eventTicketType == null) {
                return res
                    .status(404)
                    .json({ error: "Event Ticket Type does not exists" });
            }
            return res.status(200).json(eventTicketType);
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public updateEventTicketTypeById = async (
        req: IAuthenticatedRequest<IUser>,
        res: Response,
    ): Promise<Response<IEventTicketType | null>> => {
        try {
            const eventTicketTypeId = req.params.eventTicketTypeId;

            const eventTicketType =
                await this.eventTicketTypeService.getEventTicketTypeById(
                    eventTicketTypeId,
                );
            if (eventTicketType == null) {
                return res
                    .status(404)
                    .json({ error: "EventTicketType does not exists" });
            }

            const event = await this.eventService.getEventById(
                eventTicketType.eventId.toString(),
            );
            if (event.organizerId.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    error: "EventTicketType can only be modified by event owner",
                });
            }

            const eventUpdate = req.body;
            const updatedEventTicketType =
                await this.eventTicketTypeService.updateEventTicketTypeById(
                    eventTicketTypeId,
                    eventUpdate,
                );
            return res
                .status(200)
                .json({ eventTicketType: updatedEventTicketType });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public deleteEventTicketTypeById = async (
        req: IAuthenticatedRequest<IUser>,
        res: Response,
    ): Promise<Response<null>> => {
        try {
            const eventTicketTypeId = req.params.eventTicketTypeId;
            const eventTicketType =
                await this.eventTicketTypeService.getEventTicketTypeById(
                    eventTicketTypeId,
                );
            if (eventTicketType == null) {
                return res.status(404).json({
                    error: "EventTicketType does not exists",
                });
            }

            const event = await this.eventService.getEventById(
                eventTicketType.eventId.toString(),
            );
            if (event.organizerId.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    error: "EventTicketType can only be deleted by event owner",
                });
            }

            await this.eventTicketTypeService.deleteEventTicketTypeById(
                eventTicketTypeId,
            );
            return res.status(204).json();
        } catch (error) {
            return res.status(500).json(error);
        }
    };
}
