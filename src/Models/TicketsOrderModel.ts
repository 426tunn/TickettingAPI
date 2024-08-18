import mongoose, { Document, Schema } from "mongoose";
import { ITicket, TicketModel } from "./TicketModel";
import { IUser, UserModel } from "./UserModel";

export enum TicketsOrderStatusEnum {
    pending = "pending",
    paid = "paid",
}

interface ITicketsOrder extends Document {
    tickets: ITicket[];
    totalPrice: number;
    status: TicketsOrderStatusEnum;
    paymentURL: string;
    paymentAccessCode: string;
    paymentReference: string;
    buyerId: IUser;
}

const ticketsOrderSchema = new Schema<ITicketsOrder>({
    tickets: [
        { type: mongoose.Schema.Types.ObjectId, ref: TicketModel.modelName },
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: TicketsOrderStatusEnum,
        default: TicketsOrderStatusEnum.pending,
    },
    paymentURL: String,
    paymentAccessCode: String,
    paymentReference: String,
    buyerId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: UserModel.modelName,
    },
});

const TicketsOrderModel = mongoose.model<ITicketsOrder>(
    "TicketsOrder",
    ticketsOrderSchema,
);

export { ITicketsOrder, TicketsOrderModel };
