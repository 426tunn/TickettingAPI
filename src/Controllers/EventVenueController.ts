
import { Request, Response } from "express";
import { EventVenueModel, IEventVenue } from "../Models/EventVenueModel";
import { EventVenueService } from "../Services/EventVenueService";
import { validationResult } from "express-validator";


export class EventVenueController {
    private eventVenueService: EventVenueService;

    constructor() {
        this.eventVenueService = new EventVenueService(EventVenueModel);
    }

    public getAllEventVenues = async (
        _req: Request,
        res: Response,
    ): Promise<Response<IEventVenue[] | []>> => {
        try {
            const eventVenues = await this.eventVenueService.getAllEventVenues();
            return res.status(200).json({ eventVenues });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public createEventVenue = async (
        req: Request,
        res: Response,
    ): Promise<Response<IEventVenue>> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const newEventVenue = await this.eventVenueService.createEventVenue(
                req.body
            );
            return res.status(201).json({ eventVenue: newEventVenue });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public getEventVenueById = async (
        req: Request,
        res: Response,
    ): Promise<Response<IEventVenue | null>> => {
        try {
            const eventVenueId = req.params.eventVenueId;
            const event = await this.eventVenueService.getEventVenueById(eventVenueId);
            if (event == null) {
                return res.status(404).json({ error: "Event venue does not exists" });
            }
            return res.status(200).json(event);
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public updateEventVenueById = async (
        req: Request,
        res: Response,
    ): Promise<Response<Event | null>> => {
        try {
            const eventVenueId = req.params.eventVenueId;

            const event = await this.eventVenueService.getEventVenueById(eventVenueId);
            if (event == null) {
                return res.status(404).json({ error: "Event venue not exists" });
            }

            const eventVenueUpdate = req.body;
            const updatedEvent = await this.eventVenueService.updateEventVenueById(
                eventVenueId,
                eventVenueUpdate,
            );
            return res.status(200).json({ event: updatedEvent });
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    public deleteEventVenueById = async (
        req: Request,
        res: Response,
    ): Promise<Response<null>> => {
        try {
            const eventVenueId = req.params.eventVenueId;
            const eventVenue = await this.eventVenueService.getEventVenueById(
                eventVenueId
            );
            if (eventVenue == null) {
                return res.status(404).json({
                    error: "Event Venue does not exists"
                });
            }
            await this.eventVenueService.deleteEventVenueById(eventVenueId);
            return res.status(204).json();
        } catch (error) {
            return res.status(500).json(error);
        }
    };
}
