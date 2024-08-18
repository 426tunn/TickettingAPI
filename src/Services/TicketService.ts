import { ITicket, ITicketGroupedByType } from "../Models/TicketModel";
import mongoose, { Model, Query } from "mongoose";
import { TicketsOrderModel, ITicketsOrder } from "../Models/TicketsOrderModel";
import { Config } from "../Config/config";
import { IUser } from "Models/UserModel";

export class TicketService {
    private readonly ticketsOrderModel: Model<ITicketsOrder>;

    constructor(public ticketModel: Model<ITicket>) {
        this.ticketsOrderModel = TicketsOrderModel;
    }

    async getAllTickets(): Promise<ITicket[] | null> {
        return this.ticketModel.find();
    }

    async getTicketById(
        ticketId: string,
        populatePrice = false,
    ): Promise<ITicket | null> {
        let query = this.ticketModel.findById(ticketId);
        if (populatePrice) {
            query.populate("eventTicketTypeId", "price");
        }
        return query;
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
        buyerId: string,
        eventId: string,
    ): Promise<ITicket[] | null> {
        return this.ticketModel.find({ buyerId, eventId });
    }

    async createTicket({
        eventTicketTypeId,
        buyerId,
        eventId,
        quantity,
        owner,
    }: ITicket): Promise<ITicket> {
        return this.ticketModel.create({
            eventTicketTypeId,
            buyerId,
            eventId,
            quantity,
            owner,
        });
    }

    async buyTickets({
        ticketsId,
        buyer,
    }: {
        ticketsId: Array<string>;
        buyer: IUser;
    }) {
        const tickets = await Promise.all(
            ticketsId.map((id) => {
                const ticket = this.getTicketById(id, true);
                return ticket;
            }),
        );

        const invalidTicket = tickets.some((ticket) => ticket === null);
        if (invalidTicket) {
            throw new Error("Invalid ticket found");
        }

        const totalPrice = Math.ceil(
            tickets.reduce((acc, ticket) => {
                return acc + ticket.eventTicketTypeId.price;
            }, 0),
        );
        const paymentInfo = await this.initializePayment({
            price: totalPrice,
            customerEmail: buyer.email,
        });
        const ticketsOrder = this.ticketsOrderModel.create({
            tickets: ticketsId,
            totalPrice,
            paymentURL: paymentInfo.data.authorization_url,
            paymentAccessCode: paymentInfo.data.access_code,
            paymentReference: paymentInfo.data.reference,
            buyerId: buyer._id.toString(),
        });

        return ticketsOrder;
    }

    async initializePayment({
        price,
        customerEmail,
    }: {
        price: number;
        customerEmail: string;
    }) {
        const params = JSON.stringify({
            email: customerEmail,
            amount: price * 100, // base unit of 100 kb to 1 naira
        });
        const options = {
            body: params,
            hostname: "api.paystack.co",
            port: 443,
            path: "/transaction/initialize",
            method: "POST",
            headers: {
                Authorization: `Bearer ${Config.PAYSTACK_PAYMENT_SECRET}`,
                "Content-Type": "application/json",
            },
        };

        try {
            const resp = await fetch(
                "https://api.paystack.co/transaction/initialize",
                options,
            );
            const data = await resp.json();
            return data;
        } catch (error) {
            console.error("err", error);
        }
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
        buyerId: string,
        ticketUpdate: Partial<ITicket>,
    ): Promise<ITicket | null> {
        const finalUpdate = { ...ticketUpdate, buyerId, eventId };
        return this.ticketModel.findOneAndUpdate(
            { buyerId, eventId },
            finalUpdate,
            {
                new: true,
            },
        );
    }

    async deleteTicketByEventIdAndUserId(
        eventId: string,
        buyerId: string,
    ): Promise<ITicket | null> {
        return this.ticketModel.findOneAndDelete({ buyerId, eventId });
    }

    async deleteTicketById(ticketId: string): Promise<null> {
        return this.ticketModel.findByIdAndDelete(ticketId);
    }
}
