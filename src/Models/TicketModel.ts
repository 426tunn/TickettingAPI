import mongoose, { Schema, Document, model, Types } from "mongoose";
import { IEventTicketType } from "./EventTicketTypeModel";
import { IUser } from "./UserModel";

interface ITicket extends Document {
    eventTicketTypeId: IEventTicketType;
    userId: IUser;
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
    },
    { timestamps: true },
);

const TicketModel = mongoose.model<ITicket>("Ticket", ticketSchema);
export { ITicket, TicketModel };
