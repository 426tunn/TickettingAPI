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
        EMAIL: String(process.env.EMAIL),
        EMAIL_PASSWORD: String(process.env.EMAIL_PASSWORD),
        AUTH0_CLIENT_SECRET: String(process.env.AUTH0_CLIENT_SECRET),
        AUTH0_CLIENT_ID: String(process.env.AUTH0_CLIENT_ID),
        AUTH0_DOMAIN: String(process.env.AUTH0_DOMAIN),
        AUTH0_CALLBACK_URL: String(process.env.AUTH0_CALLBACK_URL),
    };
};

export const Config = getConfig();
