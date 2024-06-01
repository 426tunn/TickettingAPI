import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { logger } from "../logging/logger";

export const CLOUDINARY_CONFIG = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
};

if (Object.values(CLOUDINARY_CONFIG).includes(undefined)) {
    logger.warn("!! cloudinary config is undefined !!");
    logger.warn("export CLOUDINARY_URL or set dotenv file");
}

cloudinary.config(CLOUDINARY_CONFIG);

export default cloudinary;
