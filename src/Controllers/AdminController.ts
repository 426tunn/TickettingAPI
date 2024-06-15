import { matchedData, validationResult } from "express-validator";
import { EventService } from "../Services/EventService";
import { NextFunction, Request, Response } from "express";

export default class AdminController {
    constructor(private eventService: EventService) {}

    public updateEventStatus = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
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
}
