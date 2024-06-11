import { Request, Response } from "express";
import { NotificationModel } from "../Models/NotificationModel";

export class NotificationController {
    public getNotifications = async (req: Request, res: Response) => {
        try {
            const notifications = await NotificationModel.find().sort({
                createdAt: -1,
            });
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    public markAsRead = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await NotificationModel.findByIdAndUpdate(id, { isRead: true });
            res.status(200).json({ message: "Notification marked as read!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}
