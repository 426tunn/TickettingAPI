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


export const sendUserVerifiedEmail = async (
    email: string,
    userId: string,
) => {
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
    verificationToken: string,
) => {
    try {
        const mailOptions = {
            from: Config.EMAIL,
            to: email,
            subject: "Account Verification",
            text: `You are receiving this email because you (or someone else) has requested to verify your account.
            Please click the following link, or paste it into your browser to complete the process:
            http://${Config.HOST_URL}/users/verify-email?token=${verificationToken}`,
            html: `<p>You are receiving this email because you (or someone else) has requested to verify your account.</p>
            <p>Please click the following link to complete the process:</p>
            <a href="http://${Config.HOST_URL}/users/verify-email?token=${verificationToken}">Verify Account</a>`,
        };

        await transporter.sendMail(mailOptions);
        logger.info("Verification email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending verification email");
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
            http://${Config.BASE_URL}/users/verify-email?token=${verificationToken}
             verification: ${verificationToken}`,
        };

        await transporter.sendMail(mailOptions);
        logger.info("Verification email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending verification email");
    }
};
