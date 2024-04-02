import { ITicket } from "../Models/TicketModel";
import { Model } from "mongoose";

export class TicketService {
    constructor(public ticketModel: Model<ITicket>) { }

    async getAllTickets(): Promise<ITicket[] | null> {
        return this.ticketModel.find();
    }

    async getTicketById(ticketId: string): Promise<ITicket | null> {
        return this.ticketModel.findById(ticketId);
    }

    async getEventTickets(eventId: string): Promise<ITicket[] | null> {
        return this.ticketModel.find({ eventId });
    }

    async getUserEventTicket(
        userId: string,
        eventId: string
    ): Promise<ITicket[] | null> {
        return this.ticketModel.find({ userId, eventId });
    }

    async createTicket({
        eventTicketTypeId,
        userId,
        eventId
    }: ITicket): Promise<ITicket> {
        return this.ticketModel.create({
            eventTicketTypeId,
            userId,
            eventId
        });
    }

    async updateTicketById(
        ticketId: string,
        ticketUpdate: Partial<ITicket>,
    ): Promise<ITicket | null> {
        return this.ticketModel.findByIdAndUpdate(ticketId, ticketUpdate, {
            new: true,
        });
    }

    async updateTicketByEventIdAndUserId(
        eventId: string,
        userId: string,
        ticketUpdate: Partial<ITicket>,
    ): Promise<ITicket | null> {
        const finalUpdate = { ...ticketUpdate, userId, eventId };
        return this.ticketModel.findOneAndUpdate(
            { userId, eventId },
            finalUpdate, {
            new: true,
        });
    }

    async deleteTicketByEventIdAndUserId(
        eventId: string,
        userId: string,
    ): Promise<ITicket | null> {
        return this.ticketModel.findOneAndDelete(
            { userId, eventId }
        );
    }


    async deleteTicketById(ticketId: string): Promise<null> {
        return this.ticketModel.findByIdAndDelete(ticketId);
    }
}
