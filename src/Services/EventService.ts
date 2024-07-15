import { IEventPaginationAndSort } from "../Types/RequestTypes";
import { IEvent } from "../Models/EventModel";
import { Model, Query } from "mongoose";
import { EventStatus } from "../Enums/EventStatus";
import { EventTicketTypeService } from "./EventTicketTypeService";
import { EventTicketTypeModel } from "../Models/EventTicketTypeModel";

export class EventService {
    private eventTicketTypeService: EventTicketTypeService;
    constructor(public eventModel: Model<IEvent>) {
        this.eventTicketTypeService = new EventTicketTypeService(
            EventTicketTypeModel,
        );
    }

    getAllEvents({
        sort,
        order,
        status = EventStatus.Approved,
        organizerId,
        fieldsToSelect,
        isDeleted = false,
        startDate,
        endDate,
    }: IEventPaginationAndSort): Query<IEvent[] | [], IEvent> {
        let events;
        if (sort === "latest") {
            events = this.getAllLatestEvents({
                order,
                status,
            });
        } else if (sort === "popularity") {
            events = this.getAllPopularEvents({
                order,
                status,
            });
        } else if (sort === "date") {
            events = this.eventModel
                .find({
                    $and: [
                        { startDate: { $gte: startDate } },
                        { startDate: { $lte: endDate } },
                    ],
                })
                .find({ status });
        } else {
            events = this.eventModel.find({ status });
        }

        if (organizerId) {
            events = events.where({ organizerId });
        }

        return events.select(fieldsToSelect).where({ isDeleted });
    }

    createEvent({
        name,
        description,
        category,
        status,
        visibility,
        location,
        venueType,
        organizerId,
        startDate,
        endDate,
        media,
        tags,
    }: IEvent): IEvent {
        return new this.eventModel({
            name,
            description,
            category,
            status,
            visibility,
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
        status,
    }: IEventPaginationAndSort): Query<IEvent[], IEvent> {
        return this.eventModel.find({ status }).sort({ createdAt: order });
    }

    getAllPopularEvents({
        order = "desc",
        status,
    }: IEventPaginationAndSort): Query<IEvent[], IEvent> {
        return this.eventModel.find({ status }).sort({
            totalTickets: order,
        });
    }

    // TODO: make the service take one string argument (eventId)
    getEventById({
        eventId,
        status,
    }: {
        eventId: string;
        status?: string;
    }): Promise<IEvent | null> {
        if (status == undefined) {
            return this.eventModel.findById(eventId);
        }
        return this.eventModel.findOne({ id: eventId, status });
    }

    async updateEventById(
        eventId: string,
        eventUpdate: Partial<IEvent>,
    ): Promise<IEvent | null> {
        return this.eventModel.findByIdAndUpdate(eventId, eventUpdate, {
            new: true,
        });
    }

    async deleteEventById(eventId: string): Promise<void> {
        await this.eventModel.findByIdAndUpdate(eventId, { isDeleted: true });
        // await this.eventTicketTypeService.deleteEventTicketTypesByEventId(
        //     eventId,
        // );
        // return this.eventModel.findByIdAndDelete(eventId);
    }
}
