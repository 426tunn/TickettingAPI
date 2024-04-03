import { IEventVenue } from "../Models/EventVenueModel";
import { Model } from "mongoose";

export class EventVenueService {
    constructor(public eventVenueModel: Model<IEventVenue>) {}

    async getAllEventVenues(): Promise<IEventVenue[] | null> {
        return this.eventVenueModel.find();
    }

    async createEventVenue({
        country,
        city,
        state,
        street,
        building,
    }: IEventVenue): Promise<IEventVenue> {
        return this.eventVenueModel.create({
            country,
            city,
            state,
            street,
            building,
        });
    }

    async getEventVenueById(eventVenueId: string): Promise<IEventVenue | null> {
        return this.eventVenueModel.findById(eventVenueId);
    }

    async updateEventVenueById(
        eventVenueId: string,
        venueUpdate: Partial<IEventVenue>,
    ): Promise<IEventVenue | null> {
        return this.eventVenueModel.findByIdAndUpdate(
            eventVenueId,
            venueUpdate,
            {
                new: true,
            },
        );
    }

    async deleteEventVenueById(venueId: string): Promise<null> {
        return this.eventVenueModel.findByIdAndDelete(venueId);
    }
}
