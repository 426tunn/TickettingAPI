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
        organizerId,
        attributesToSelect,
    }: IEventPaginationAndSort): Promise<IEvent[] | null> {
        if (sort === "latest") {
            return this.getAllLatestEvents({
                order,
                page,
                perPage,
                status,
                organizerId,
                attributesToSelect,
            });
        }

        if (sort === "popularity") {
            return this.getAllPopularEvents({
                order,
                page,
                perPage,
                status,
                organizerId,
                attributesToSelect,
            });
        }

        if (organizerId) {
            return this.eventModel
                .find({ status, organizerId })
                .select(attributesToSelect)
                .limit(perPage)
                .skip((page - 1) * perPage);
        }

        return this.eventModel
            .find({ status })
            .select(attributesToSelect)
            .limit(perPage)
            .skip((page - 1) * perPage);
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
        organizerId,
        attributesToSelect,
    }: IEventPaginationAndSort): Promise<IEvent[] | null> {
        if (organizerId) {
            return this.eventModel
                .find({ status, organizerId })
                .select(attributesToSelect)
                .sort({ createdAt: order })
                .limit(perPage)
                .skip((page - 1) * perPage);
        }
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
        organizerId,
        attributesToSelect,
    }: IEventPaginationAndSort): Promise<IEvent[] | null> {
        if (organizerId) {
            return this.eventModel
                .find({ status, organizerId })
                .select(attributesToSelect)
                .sort({
                    totalTickets: order,
                })
                .limit(perPage)
                .skip((page - 1) * perPage);
        }

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
