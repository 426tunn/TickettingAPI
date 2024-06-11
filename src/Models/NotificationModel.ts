import mongoose, { Schema, Document, Types } from "mongoose";

interface INotification extends Document {
    action: string;
    details: string;
    userId: Types.ObjectId;
    createdAt: Date;
    isRead: boolean;
}

const notificationSchema = new Schema<INotification>({
    action: { type: String, required: true },
    details: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
});

const NotificationModel = mongoose.model<INotification>(
    "Notification",
    notificationSchema,
);

export { INotification, NotificationModel };
