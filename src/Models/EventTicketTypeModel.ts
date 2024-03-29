import mongoose, { Schema, Document} from "mongoose";
import { TicketTypes } from "Enums/TicketTypes";

interface IEventTicketType extends Document {
    name: TicketTypes;
    price: number;
    NoOfTickets: number;
}

const eventTicketTypeSchema = new Schema<IEventTicketType>(
    {
        name: {
            type: String,
            enum: Object.values(TicketTypes),
            // default: TicketTypes.Standard,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        NoOfTickets: {
            type: Number,
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
