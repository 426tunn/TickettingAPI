import { config } from "dotenv";
import path from "path";
config();
((): void => {
    config({
        path: path.join(__dirname, "./../", ".env"),
    });
})();

const getConfig = function () {
    return {
        PORT: Number(process.env.PORT || 3010),
        DBURL: String(process.env.DBURL),
        JWTSecret: String(process.env.JWT_SECRET),
        SESSION_SECRET: String(process.env.SESSION_SECRET),
        HOST_URL: String(process.env.HOST_URL),
        BASE_URL: String(process.env.BASE_URL),
        EMAIL: String(process.env.EMAIL),
        EMAIL_PASSWORD: String(process.env.EMAIL_PASSWORD),
        GOOGLE_CLIENT_ID: String(process.env.GOOGLE_CLIENT_ID),
        GOOGLE_CLIENT_SECRET: String(process.env.GOOGLE_CLIENT_SECRET),
        OAUTH_PASSWORD: String(process.env.OAUTH_PASSWORD),
        FRONTEND_URL: String(process.env.FRONTEND_URL),
        SMTP_HOST: String(process.env.SMTP_HOST),
        SMTP_PORT: Number(process.env.SMTP_PORT),
        SMTP_SECURE: Boolean(process.env.SMTP_SECURE),
        SMTP_USER: String(process.env.SMTP_USER),
        SMTP_PASS: String(process.env.SMTP_PASS),
    };
};

export const Config = getConfig();
