import { EventStatus } from "../Enums/EventStatus";
import { EventTypes } from "../Enums/EventTypes";
import { EventVisibility } from "../Enums/EventVisibility";
import { LocationTypes } from "../Enums/LocationTypes";
import { IUser } from "./UserModel";
import { IEventVenue } from "./EventVenueModel";
import { IEventTicketType } from "./EventTicketTypeModel";
import mongoose, { Schema, Document } from "mongoose";

interface IEvent extends Document {
    name: string;
    description: string;
    status: EventStatus;
    visibility: EventVisibility;
    type: EventTypes;
    venue: IEventVenue;
    location: LocationTypes;
    ticketTypes: IEventTicketType[];
    organizerId: IUser;
    startDate: Date;
    endDate: Date;
    bannerImageUrl?: string | null;
}

const eventSchema = new Schema<IEvent>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(EventStatus),
            // default: EventStatus.Pending,
            required: true,
        },
        visibility: {
            type: String,
            enum: Object.values(EventVisibility),
            // default: EventVisibility.Public,
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(EventTypes),
            // default: EventTypes.Free,
            required: true,
        },
        venue: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EventVenue",
            required: true,
        },
        ticketTypes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "EventTicketType",
                required: true,
            },
        ],
        location: {
            type: String,
            enum: Object.values(LocationTypes),
            // default: LocationTypes.Online,
            required: true,
        },
        organizerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        bannerImageUrl: {
            type: String,
        },
    },
    { timestamps: true },
);

const EventModel = mongoose.model<IEvent>("Event", eventSchema);
export { IEvent, EventModel };
