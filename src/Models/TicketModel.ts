import mongoose, { Schema, Document } from "mongoose";
import { IEventTicketType } from "./EventTicketTypeModel";
import { IUser } from "./UserModel";
import { EventModel, IEvent } from "./EventModel";
import { EventService } from "../Services/EventService";

interface ITicket extends Document {
    eventTicketTypeId: IEventTicketType;
    userId: IUser;
    eventId: IEvent;
}

export interface ITicketGroupedByType {
    _id: mongoose.Types.ObjectId;
    tickets: ITicket[];
    ticketType: IEventTicketType;
    totalTicketsSold: number;
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

const eventService = new EventService(EventModel);

ticketSchema.post(
    ["save", "deleteOne", "findOneAndDelete"],
    async function (doc) {
        const totalTickets = await TicketModel.countDocuments({
            eventId: doc.eventId,
        });
        await eventService.updateEventById(doc.eventId.toString(), {
            totalTickets: totalTickets,
        });
    },
);
const TicketModel = mongoose.model<ITicket>("Ticket", ticketSchema);
export { ITicket, TicketModel };
