import { ITicket, ITicketGroupedByType } from "../Models/TicketModel";
import mongoose, { Model, Query } from "mongoose";

export class TicketService {
    constructor(public ticketModel: Model<ITicket>) {}

    async getAllTickets(): Promise<ITicket[] | null> {
        return this.ticketModel.find();
    }

    async getTicketById(ticketId: string): Promise<ITicket | null> {
        return this.ticketModel.findById(ticketId);
    }

    getTotalEventTicketTypessSold(
        eventId: string,
        eventTicketTypeId: string,
    ): Promise<number> {
        return this.ticketModel.countDocuments({ eventId, eventTicketTypeId });
    }

    getEventTickets(eventId: string): Query<ITicket[] | null, ITicket> {
        return this.ticketModel.find({ eventId });
    }

    async getEventTicketsGroupedByTicketType(
        eventId: string,
    ): Promise<ITicket[] | null> {
        return this.ticketModel.aggregate([
            {
                $match: { eventId: new mongoose.Types.ObjectId(eventId) },
            },
            {
                $lookup: {
                    from: "eventtickettypes",
                    localField: "eventTicketTypeId",
                    foreignField: "_id",
                    as: "ticketType",
                },
            },
            {
                $unwind: "$ticketType",
            },
            {
                $group: {
                    _id: "$ticketType._id",
                    ticketType: { $first: "$ticketType" },
                    tickets: { $push: "$$ROOT" },
                    totalTicketsSold: { $sum: 1 },
                },
            },
        ]);
    }

    async getTicketSalesDetailsForEvent(eventId: string) {
        // TODO: add the proper types to the return types
        const ticketsGroupedByType =
            (await this.getEventTicketsGroupedByTicketType(
                eventId,
            )) as unknown as ITicketGroupedByType[];

        const salesByTicketType = ticketsGroupedByType.map((groupedType) => {
            return {
                id: groupedType._id,
                ticketType: groupedType.ticketType.name,
                price: groupedType.ticketType.price,
                sold: groupedType.tickets.length,
                total: groupedType.ticketType.quantity,
            };
        });

        const [totalTicketsSold, totalTickets, totalRevenue] =
            salesByTicketType.reduce(
                (totalTicketsSoldAndTotalTickets, currentTicketTypeGroup) => {
                    return [
                        totalTicketsSoldAndTotalTickets[0] +
                            currentTicketTypeGroup.sold,
                        totalTicketsSoldAndTotalTickets[1] +
                            currentTicketTypeGroup.total,
                        totalTicketsSoldAndTotalTickets[2] +
                            currentTicketTypeGroup.sold *
                                currentTicketTypeGroup.price,
                    ];
                },
                [0, 0, 0],
            );

        return {
            totalTickets,
            totalTicketsSold,
            salesByTicketType,
            totalRevenue,
        };
    }

    async getUserEventTicket(
        userId: string,
        eventId: string,
    ): Promise<ITicket[] | null> {
        return this.ticketModel.find({ userId, eventId });
    }

    async createTicket({
        eventTicketTypeId,
        userId,
        eventId,
        quantity,
        owner,
    }: ITicket): Promise<ITicket> {
        return this.ticketModel.create({
            eventTicketTypeId,
            userId,
            eventId,
            quantity,
            owner,
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
            finalUpdate,
            {
                new: true,
            },
        );
    }

    async deleteTicketByEventIdAndUserId(
        eventId: string,
        userId: string,
    ): Promise<ITicket | null> {
        return this.ticketModel.findOneAndDelete({ userId, eventId });
    }

    async deleteTicketById(ticketId: string): Promise<null> {
        return this.ticketModel.findByIdAndDelete(ticketId);
    }
}
