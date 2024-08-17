import mongoose, { Schema } from "mongoose";
import { ITicket, TicketModel } from "./TicketModel";

enum TicketOrderStatusEnum {
    pending = "pending",
    paid = "paid",
}

interface ITicketOrder {
    tickets: ITicket[];
    status: TicketOrderStatusEnum;
    paymentURL: string;
    paymentAccessCode: string;
    paymentReference: string;
}

const ticketOrderSchema = new Schema<ITicketOrder>({
    tickets: [
        { type: mongoose.Schema.Types.ObjectId, ref: TicketModel.modelName },
    ],
    status: {
        type: String,
        enum: TicketOrderStatusEnum,
        default: TicketOrderStatusEnum.pending,
    },
    paymentURL: String,
    paymentAccessCode: String,
    paymentReference: String,
});

const TicketOrderModel = mongoose.model<ITicketOrder>(
    "TicketOrder",
    ticketOrderSchema,
);

export { ITicketOrder, TicketOrderModel };
