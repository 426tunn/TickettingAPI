import mongoose from "mongoose";
import { Config } from "./Config/config"; 

const logger = require('./logging/logger');
const DBURL = Config.DBURL;

export const connectToDB = (): void => {
    mongoose.connect(DBURL);
    const DBConnection = mongoose.connection;
    DBConnection.on("connected", () => {
        logger.info("mongoose connected");
    });
    DBConnection.on("error", (error) => {
        logger.error("mongoose connection error:", error);
    });
};
