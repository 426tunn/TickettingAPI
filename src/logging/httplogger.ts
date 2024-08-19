import morgan from "morgan";
import json from "morgan-json";
import { logger } from "./logger";

const format = json({
    method: ":method",
    url: ":url",
    status: ":status"
});

const httpLogger = morgan(format, {
    stream: {
        write: (message: string) => {
            const { method, url, status } =
                JSON.parse(message);

                if (status >= 400) {
                    logger.error(`HTTP ${status} - ${method} ${url}`);
                } else {
                    logger.info(`HTTP ${status} - ${method} ${url}`);
                }
        },
    },
});

module.exports = httpLogger;
