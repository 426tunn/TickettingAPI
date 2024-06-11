import { Router } from "express";
import { NotificationController } from "../Controllers/NotificationController";

const notificationRouter = Router();
const notificationController = new NotificationController();

notificationRouter.get(
    "/notifications",
    notificationController.getNotifications,
);
notificationRouter.put(
    "/notifications/:id/read",
    notificationController.markAsRead,
);

export { notificationRouter };
