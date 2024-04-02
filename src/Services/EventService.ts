import { IEvent } from "Models/EventModel";
import { Model } from "mongoose";

export class EventService {
    constructor(public eventModel: Model<IEvent>) {}

    async getAllEvents(): Promise<IEvent[] | null> {
        return this.eventModel.find();
    }

    async createEvent({
        name,
        description,
        status,
        type,
        venue,
        ticketTypes,
        location,
        organizerId,
        startDate,
        endDate,
        bannerImageUrl,
        totalTickets,
    }: IEvent): Promise<IEvent> {
        return this.eventModel.create({
            name,
            description,
            status,
            type,
            venue,
            ticketTypes,
            location,
            organizerId,
            startDate,
            endDate,
            bannerImageUrl,
            totalTickets,
        });
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
