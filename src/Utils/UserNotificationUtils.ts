import { logger } from "../logging/logger";
import { NotificationModel } from "../Models/NotificationModel";

export class UserNotificationUtils {
    static async createUserCreationNotification(userId: string, email: string) {
        try {
            const message = `User ID: ${userId} with email: ${email} was created`;
            const notification = new NotificationModel({
                action: "User Creation",
                details: message,
                userId: userId,
            });
            await notification.save();
        } catch (error) {
            logger.error(
                `Failed to create user creation notification: ${error}`,
            );
        }
    }

    static async createRoleChangeNotification(
        userId: string,
        requestedRole: string,
    ) {
        try {
            const message = `User ID: ${userId} requested a role change to "${requestedRole}"`;
            const notification = new NotificationModel({
                action: "Role Change Request",
                details: message,
                userId: userId,
            });
            await notification.save();
        } catch (error) {
            logger.error("Error sending role change notification:", error);
        }
    }

    static async updateUserProfileNotification(userId: string) {
        try {
            const message = `User ID: ${userId} has just updated their profile`;
            const notification = new NotificationModel({
                action: "User Profile Updated",
                details: message,
                userId: userId,
            });
            await notification.save();
        } catch (error) {
            logger.error("Error sending profile update notification:", error);
        }
    }
}
