import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
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
    recipientName: string,
) => {
    try {

        const htmlPath = path.join(__dirname, "../templates/reset-password.html");
        let resetPasswordHtml = fs.readFileSync(htmlPath, "utf8");

        resetPasswordHtml = resetPasswordHtml.replace('[Recipient\'s Name]', recipientName);
        resetPasswordHtml = resetPasswordHtml.replace('{{resetLink}}', `${Config.FRONTEND_URL}/auth/reset-password?resetToken=${resetToken}`);

        const mailOptions = {
            from: Config.EMAIL,
            to: email,
            subject: "Password Reset",
            html: resetPasswordHtml,
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
    recipientName: string
) => {
    try {
        const htmlPath = path.join(__dirname, "../templates/welcome-email-verification.html");
        let verifyEmailHtml = fs.readFileSync(htmlPath, "utf8");

        verifyEmailHtml = verifyEmailHtml.replace('[Recipient\'s Name]', recipientName);
        verifyEmailHtml = verifyEmailHtml.replace('{{resetLink}}', `${Config.BASE_URL}users/verify-email?token=${verificationToken}`);
        const mailOptions = {
            from: Config.EMAIL,
            to: email,
            subject: "Account Verification",
            html: verifyEmailHtml,
        };

        await transporter.sendMail(mailOptions);
        logger.info("Verification email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending verification email");
    }
};
