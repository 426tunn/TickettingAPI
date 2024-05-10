import mongoose, { Schema, Document } from "mongoose";
import { TicketTypes } from "../Enums/TicketTypes";
import { IEvent } from "./EventModel";

interface IEventTicketType extends Document {
    name: string;
    price: number;
    quantity: number;
    eventId: IEvent;
}

const eventTicketTypeSchema = new Schema<IEventTicketType>(
    {
        name: {
            type: String,
            // enum: Object.values(TicketTypes),
            // default: TicketTypes.Standard,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
    },
    { timestamps: true },
);

const EventTicketTypeModel = mongoose.model<IEventTicketType>(
    "EventTicketType",
    eventTicketTypeSchema,
);
export { IEventTicketType, EventTicketTypeModel };
