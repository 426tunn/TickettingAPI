import mongoose, { Schema, Document } from "mongoose";
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

eventTicketTypeSchema.pre("save", function () {
    this.price = parseFloat(this.price.toFixed(2));
});

const EventTicketTypeModel = mongoose.model<IEventTicketType>(
    "EventTicketType",
    eventTicketTypeSchema,
);
export { IEventTicketType, EventTicketTypeModel };
