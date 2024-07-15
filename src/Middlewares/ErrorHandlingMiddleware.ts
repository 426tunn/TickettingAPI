// import express from 'express';
import { Request, Response, NextFunction } from "express";

// Custom error interface extending the built-in Error
interface CustomError extends Error {
    statusCode?: number;
}

// Error handling middleware
const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    console.error(err.stack); // Log the full error stack for debugging purposes

    // Customize the response based on error type
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Send a detailed error response in development
    if (process.env.NODE_ENV === "development") {
        res.status(statusCode).json({
            status: "error",
            statusCode,
            message,
            stack: err.stack,
        });
    } else {
        // Send a generic error response in production
        res.status(statusCode).json({
            status: "error",
            statusCode,
            message,
        });
    }
};

export default errorHandler;
