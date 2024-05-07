import { IEventPaginationAndSort } from "../Types/RequestTypes";
import { IEvent } from "../Models/EventModel";
import { Model } from "mongoose";
import { EventStatus } from "../Enums/EventStatus";

export class EventService {
    constructor(public eventModel: Model<IEvent>) {}

    async getAllEventsCount(): Promise<number> {
        return this.eventModel.countDocuments();
    }

    async getAllEvents({
        page,
        perPage,
        sort,
        order,
        status = EventStatus.Approved,
    }: IEventPaginationAndSort): Promise<IEvent[] | null> {
        if (sort === "latest") {
            return this.getAllLatestEvents({ order, page, perPage, status });
        } else if (sort === "popularity") {
            return this.getAllPopularEvents({ order, page, perPage, status });
        } else {
            return this.eventModel
                .find({ status })
                .limit(perPage)
                .skip((page - 1) * perPage);
        }
    }

    async createEvent({
        name,
        description,
        category,
        status,
        visibility,
        type,
        location,
        venueType,
        organizerId,
        startDate,
        endDate,
        media,
        tags,
    }: IEvent): Promise<IEvent> {
        return this.eventModel.create({
            name,
            description,
            category,
            status,
            visibility,
            type,
            location,
            venueType,
            organizerId,
            startDate,
            endDate,
            media,
            tags,
        });
    }

    getAllLatestEvents({
        order = "desc",
        page,
        perPage,
        status,
    }: IEventPaginationAndSort): Promise<IEvent[] | null> {
        return this.eventModel
            .find({ status })
            .sort({ createdAt: order })
            .limit(perPage)
            .skip((page - 1) * perPage);
    }

    getAllPopularEvents({
        order = "desc",
        page,
        perPage,
        status,
    }: IEventPaginationAndSort): Promise<IEvent[] | null> {
        const events = this.eventModel
            .find({ status })
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
