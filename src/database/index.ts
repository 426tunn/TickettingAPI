import mongoose from "mongoose";
import { Config } from "../Config/config";

import { logger } from "../logging/logger";
const DBURL = Config.DBURL;

export const connectToDB = (): void => {
    mongoose.connect(DBURL, {
        readPreference: 'primary', // or 'secondaryPreferred' depending on your needs
        writeConcern: {
            w: 'majority', // Ensures writes are acknowledged by the majority of nodes
            j: true // Ensures that writes are journaled
        }
    });
    const DBConnection = mongoose.connection;
    DBConnection.on("connected", () => {
        logger.info("mongoose connected");
    });
    DBConnection.on("error", (error) => {
        logger.error("mongoose connection error:", error);
    });
};
