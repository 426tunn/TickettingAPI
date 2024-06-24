import { matchedData, validationResult } from "express-validator";
import { EventService } from "../Services/EventService";
import { NextFunction, Request, Response } from "express";
import { IEventPaginationAndSortReq } from "../Types/RequestTypes";
import { EventStatus } from "../Enums/EventStatus";

export default class AdminController {
    constructor(private eventService: EventService) {}

    public getAllEvents = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const page = parseInt((req.query.page as string) || "1");
            const perPage = parseInt((req.query.perPage as string) || "9");
            const events = await this.eventService
                .getAllEvents({
                    page,
                    perPage,
                    status: Object.values(EventStatus),
                    fieldsToSelect:
                        "name startDate endDate status category location",
                })
                .populate(
                    "organizerId",
                    "-password -verificationToken -verificationExpire",
                );
            return res.status(200).json({
                data: events,
                message: "Events gotten",
            });
        } catch (error) {
            if (error.statusCode && error.statusCode !== 500) {
                return next(error);
            }
            return res.status(500).json({ error, message: error.message });
        }
    };

    public updateEventStatus = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        // TODO: extract request detector into a middleware
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { eventId } = req.params;
            const { status } = matchedData(req);
            const updatedEvent = await this.eventService.updateEventById(
                eventId,
                {
                    status,
                },
            );
            return res.status(200).json({
                data: updatedEvent,
                message: "Event status updated successfully",
            });
        } catch (error) {
            if (error.statusCode && error.statusCode !== 500) {
                return next(error);
            }
            return res.status(500).json({ error, message: error.message });
        }
    };

    public getDeletedEvents = async (
        req: Request & IEventPaginationAndSortReq,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const page = parseInt(req.query.page || "1");
            const perPage = parseInt(req.query.perPage || "9");
            const { sort, order } = req.query;
            const { organizerId } = req.params;

            const events = await this.eventService.getAllEvents({
                sort,
                order,
                page,
                perPage,
                organizerId,
                isDeleted: true,
            });

            const totalNoOfPages = Math.ceil(events.length / perPage);
            return res.status(200).json({
                message: "Deleted events",
                page,
                perPage,
                totalNoOfPages,
                events,
            });
        } catch (error) {
            if (error.statusCode && error.statusCode !== 500) {
                return next(error);
            }
            return res.status(500).json(error);
        }
    };
}
