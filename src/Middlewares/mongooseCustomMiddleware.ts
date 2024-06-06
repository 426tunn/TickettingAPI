import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";

export function isValidMongooseIdMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): Response<Record<string, string>> | void {
    for (const key in req.params) {
        const isId = key.toLowerCase().includes("id");
        if (isId && !isValidObjectId(req.params[key])) {
            return res.status(400).json({ error: `Invalid Id for: ${key} ` });
        }
    }
    return next();
}
