import mongoose, { Schema, Document } from "mongoose";
import { IEventTicketType } from "./EventTicketTypeModel";
import { IUser } from "./UserModel";
import { IEvent } from "./EventModel";

interface ITicket extends Document {
    eventTicketTypeId: IEventTicketType;
    userId: IUser;
    eventId: IEvent;
}

const ticketSchema = new Schema<ITicket>(
    {
        eventTicketTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EventTicketType",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
    },
    { timestamps: true },
);

const TicketModel = mongoose.model<ITicket>("Ticket", ticketSchema);
export { ITicket, TicketModel };
