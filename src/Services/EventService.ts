import { PaginationAndSort } from "../Types/RequestTypes";
import { IEvent } from "../Models/EventModel";
import { Model } from "mongoose";

export class EventService {
    constructor(public eventModel: Model<IEvent>) {}

    async getAllEvents({
        page = 1,
        perPage = 9,
    }: PaginationAndSort): Promise<IEvent[] | null> {
        return this.eventModel
            .find()
            .limit(perPage)
            .skip((page - 1) * perPage);
    }

    async createEvent({
        name,
        description,
        status,
        visibility,
        type,
        venue,
        ticketTypes,
        location,
        organizerId,
        startDate,
        endDate,
        bannerImageUrl,
    }: IEvent): Promise<IEvent> {
        return this.eventModel.create({
            name,
            description,
            status,
            visibility,
            type,
            venue,
            ticketTypes,
            location,
            organizerId,
            startDate,
            endDate,
            bannerImageUrl,
        });
    }

    async getAllLatestEvents({
        order = "desc",
        page = 1,
        perPage = 9,
    }: PaginationAndSort): Promise<IEvent[] | null> {
        return this.eventModel
            .find({})
            .sort({ createdAt: order })
            .limit(perPage)
            .skip((page - 1) * perPage);
    }

    async getAllPopularEvents({
        order = "desc",
        page = 1,
        perPage = 9,
    }: PaginationAndSort): Promise<IEvent[] | null> {
        const events = await this.eventModel
            .find()
            .sort({
                totalTickets: order,
            })
            .limit(perPage)
            .skip((page - 1) * perPage);
        return events;
    }

    async getEventById(eventId: string): Promise<IEvent | null> {
        return this.eventModel.findById(eventId);
    }

    async updateEventById(
        eventId: string,
        eventUpdate: Partial<IEvent>,
    ): Promise<IEvent | null> {
        return this.eventModel.findByIdAndUpdate(eventId, eventUpdate, {
            new: true,
        });
    }

    async deleteEventById(eventId: string): Promise<null> {
        return this.eventModel.findByIdAndDelete(eventId);
    }
}
