import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { Config } from "../Config/config";
import { logger } from "../logging/logger";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_PORT === '465', 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS  
    },
    tls: {
        rejectUnauthorized: false // avoid issues with self-signed certificates
    }
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
        const htmlPath = path.join(
            __dirname,
            "../templates/reset-password.html",
        );
        let resetPasswordHtml = fs.readFileSync(htmlPath, "utf8");

        resetPasswordHtml = resetPasswordHtml.replace(
            "[Recipient's Name]",
            recipientName,
        );
        resetPasswordHtml = resetPasswordHtml.replace(
            "{{resetLink}}",
            `${Config.FRONTEND_URL}/auth/reset-password?resetToken=${resetToken}`,
        );

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
    recipientName: string,
) => {
    try {
        const htmlPath = path.join(
            __dirname,
            "../templates/welcome-email-verification.html",
        );
        let verifyEmailHtml = fs.readFileSync(htmlPath, "utf8");

        verifyEmailHtml = verifyEmailHtml.replace(
            "[Recipient's Name]",
            recipientName,
        );
        verifyEmailHtml = verifyEmailHtml.replace(
            "{{resetLink}}",
            `${Config.BASE_URL}users/verify-email?token=${verificationToken}`,
        );
        const mailOptions = {
            from: Config.EMAIL,
            to: email,
            subject: "Account Verification",
            html: verifyEmailHtml,
        };

        await transporter.sendMail(mailOptions);
        logger.info("Verification email sent successfully");
    } catch (error) {
        logger.error(error.message);
        console.error(error.message);
        throw new Error(error.message);
    }
};
