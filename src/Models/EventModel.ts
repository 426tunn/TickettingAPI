import { EventStatus } from "../Enums/EventStatus";
import { EventTypes } from "../Enums/EventTypes";
import { EventVisibility } from "../Enums/EventVisibility";
import { LocationTypes } from "../Enums/LocationTypes";
import { IUser } from "./UserModel";
import mongoose, { Schema, Document } from "mongoose";

interface IEvent extends Document {
    name: string;
    description: string;
    status: EventStatus;
    visibility: EventVisibility;
    type: EventTypes;
    venue: string;
    location: LocationTypes;
    organizerId: IUser;
    startDate: Date;
    endDate: Date;
    bannerImageUrl?: string | null;
    totalTickets: number;
    verified: boolean;
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
            type: String,
            required: true,
        },
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
        totalTickets: {
            type: Number,
            default: 0,
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const EventModel = mongoose.model<IEvent>("Event", eventSchema);
export { IEvent, EventModel };
