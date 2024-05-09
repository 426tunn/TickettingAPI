import jwt from "jsonwebtoken";
import { Config } from "../Config/config";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { IUser } from "../Models/UserModel";

export function generateTokenWithRole(res: Response, user: IUser) {
    const payload = {
        user: user,
    };

    const token = jwt.sign(payload, Config.JWTSecret, { expiresIn: "1h" });
    res.cookie("jwt_token", token, {
        maxAge: 3600000,
        httpOnly: true,
    });
    return token;
}

export function authenticateJWT(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    passport.authenticate(
        "jwt",
        { session: false },
        (err: Error, user: IUser) => {
            if (err || !user) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            req.user = user;
            next();
        },
    )(req, res, next);
}

export function isEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
