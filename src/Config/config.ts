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
        // HOST_URL: String(process.env.HOST_URL)
    };
};

export const Config = getConfig();
