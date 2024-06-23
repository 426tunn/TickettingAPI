import nodemailer from "nodemailer";
import { Config } from "../Config/config";
import { logger } from "../logging/logger";

const transporter = nodemailer.createTransport({
    service: "googlemail.com",
    auth: {
        user: Config.EMAIL,
        pass: Config.EMAIL_PASSWORD,
    },
});

export const sendUserVerifiedEmail = async (email: string, userId: string) => {
    try {
        const mailOptions = {
            from: Config.EMAIL,
            to: email,
            subject: "Account Verified",
            text: `Account with user id ${userId}  has been successfully verified. Thank you!`,
        };

        await transporter.sendMail(mailOptions);
        logger.info("Verified email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending verified email");
    }
};

export const sendPasswordResetEmail = async (
    email: string,
    resetToken: string,
) => {
    try {
        const mailOptions = {
            from: Config.EMAIL,
            to: email,
            subject: "Password Reset",
            text: `You are receiving this email because you (or someone else) has requested a password reset for your account.
        Please click the following link, or paste it into your browser to complete the process:
        
        http://${Config.HOST_URL}/users/reset-password?resetToken=${resetToken}
        reset: ${resetToken}
        
        If you did not request this, please ignore this email and your password will remain unchanged.`,
        };

        await transporter.sendMail(mailOptions);
        logger.info("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending password reset email");
    }
};

export const sendVerificationEmail = async (
    email: string,
    verificationToken: string,
) => {
    try {
        const mailOptions = {
            from: Config.EMAIL,
            to: email,
            subject: "Account Verification",
            text: `You are receiving this email because you (or someone else) has requested to verify your account.
            Please click the following link, or paste it into your browser to complete the process:
           ${Config.BASE_URL}/users/verify-email?token=${verificationToken}
             verification: ${verificationToken}`,
        };

        await transporter.sendMail(mailOptions);
        logger.info("Verification email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending verification email");
    }
};
