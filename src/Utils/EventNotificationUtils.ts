import { logger } from "../logging/logger";
import { NotificationModel } from "../Models/NotificationModel";
import { Types } from "mongoose";

export class EventNotificationUtils {
    static async createEventNotification(
        organizerId: Types.ObjectId,
        eventName: string,
        eventId: Types.ObjectId,
    ) {
        try {
            const message = `Organizer with ID: ${organizerId} has just created an event named "${eventName}" with ID: ${eventId}`;
            const notification = new NotificationModel({
                action: "Event Created",
                details: message,
                organizerId: organizerId,
            });
            await notification.save();
        } catch (error) {
            logger.error("Error sending create event notification:", error);
        }
    }

    static async deleteEventNotification(
        organizerId: Types.ObjectId,
        eventName: string,
        eventId: Types.ObjectId,
    ) {
        try {
            const message = `Organizer with ID: ${organizerId} has just deleted an event named "${eventName}" with ID: ${eventId}`;
            const notification = new NotificationModel({
                action: "Event Deleted",
                details: message,
                organizerId: organizerId,
            });
            await notification.save();
        } catch (error) {
            logger.error("Error sending delete event notification:", error);
        }
    }

    // Add more methods for different notifications as needed
}
