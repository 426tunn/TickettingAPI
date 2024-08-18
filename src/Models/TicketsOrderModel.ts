import mongoose, { Document, Schema } from "mongoose";
import { ITicket, TicketModel } from "./TicketModel";

enum TicketsOrderStatusEnum {
    pending = "pending",
    paid = "paid",
}

interface ITicketsOrder extends Document {
    tickets: ITicket[];
    status: TicketsOrderStatusEnum;
    paymentURL: string;
    paymentAccessCode: string;
    paymentReference: string;
}

const ticketsOrderSchema = new Schema<ITicketsOrder>({
    tickets: [
        { type: mongoose.Schema.Types.ObjectId, ref: TicketModel.modelName },
    ],
    status: {
        type: String,
        enum: TicketsOrderStatusEnum,
        default: TicketsOrderStatusEnum.pending,
    },
    paymentURL: String,
    paymentAccessCode: String,
    paymentReference: String,
});

const TicketOrderModel = mongoose.model<ITicketsOrder>(
    "TicketOrder",
    ticketsOrderSchema,
);

export { ITicketsOrder, TicketOrderModel };
