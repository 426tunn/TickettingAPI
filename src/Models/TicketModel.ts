import mongoose, { Schema, Document } from "mongoose";
import { IEventTicketType } from "./EventTicketTypeModel";
import { IUser } from "./UserModel";
import { EventModel, IEvent } from "./EventModel";
import { EventService } from "../Services/EventService";

interface ITicket extends Document {
    eventTicketTypeId: IEventTicketType;
    buyerId: IUser;
    eventId: IEvent;
    quantity: number;
    owner: ITicketOwnerDetails;
}

export interface ITicketGroupedByType {
    _id: mongoose.Types.ObjectId;
    tickets: ITicket[];
    ticketType: IEventTicketType;
    totalTicketsSold: number;
}

interface ITicketOwnerDetails {
    firstName: string;
    lastName: string;
    email: string;
}

const ownerDetails = new Schema<ITicketOwnerDetails>({
    firstName: String,
    lastName: String,
    email: String,
});

const ticketSchema = new Schema<ITicket>(
    {
        eventTicketTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EventTicketType",
            required: true,
        },
        owner: ownerDetails,
        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        quantity: {
            type: mongoose.Schema.Types.Number,
            default: 1,
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
