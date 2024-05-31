import { EventCategory } from "../Enums/EventCategory";
import { EventStatus } from "../Enums/EventStatus";
import { EventType } from "../Enums/EventType";
import { EventVisibility } from "../Enums/EventVisibility";
import { VenueType } from "../Enums/VenueType";
import { EventTicketTypeModel } from "./EventTicketTypeModel";
import { IUser } from "./UserModel";
import mongoose, { Schema, Document } from "mongoose";

interface ILocation {
    venue: string;
    city: string;
    state: string;
    address: string;
}

interface IMedia {
    bannerImage: {
        imgType: string;
        src: string;
    };
    mobilePreviewImage: {
        imgType: string;
        src: string;
    };
}

interface IEvent extends Document {
    name: string;
    description: string;
    category: EventCategory;
    status: EventStatus;
    visibility: EventVisibility;
    type: EventType;
    location: ILocation;
    venueType: VenueType;
    organizerId: IUser;
    startDate: Date;
    endDate: Date;
    media?: IMedia;
    totalTickets: number;
    tags: string[];
}

const locationSchema = new Schema<ILocation>({
    venue: String,
    city: String,
    state: String,
    address: String,
});

const mediaSchema = new Schema<IMedia>({
    bannerImage: {
        type: {
            imgType: String,
            src: String,
        },
    },
    mobilePreviewImage: {
        type: {
            imgType: String,
            src: String,
        },
    },
});

const eventSchema = new Schema<IEvent>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
            maxLength: 500,
        },
        category: {
            type: String,
            enum: Object.values(EventCategory),
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(EventStatus),
            default: EventStatus.Pending,
        },
        visibility: {
            type: String,
            enum: Object.values(EventVisibility),
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(EventType),
            required: true,
        },
        location: {
            type: locationSchema,
            required: true,
        },
        venueType: {
            type: String,
            enum: Object.values(VenueType),
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
        media: {
            type: mediaSchema,
        },
        tags: [String],
        totalTickets: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

const EventModel = mongoose.model<IEvent>("Event", eventSchema);
export { IEvent, EventModel };
