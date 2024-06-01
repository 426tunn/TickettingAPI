import { UserRole } from "Enums/UserRole";
import { IUser } from "Models/UserModel";
import { IAuthenticatedRequest } from "Types/RequestTypes";
import { Request, Response, NextFunction } from "express";
import passport from "passport";

export const revokedTokens = new Set();
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
            const token = req.headers.authorization?.split(" ")[1];
            if (token && revokedTokens.has(token)) {
                return res
                    .status(401)
                    .json({ message: "Token revoked: Unauthorized" });
            }
            req.user = user;
            next();
        },
    )(req, res, next);
}

export function checkIfUserIsAdmin(
    req: IAuthenticatedRequest<Partial<IUser>>,
    res: Response,
    next: NextFunction,
) {
    if (!req.user) {
        return res
            .status(401)
            .json({ message: "Unauthorized: You need to be logged in" });
    }

    if (req.user?.role as UserRole !== "admin" && req.user?.role as UserRole !== "superadmin") {
        return res
            .status(403)
            .json({ message: "Forbidden: User is not an admin" });
    }
    next();
}

export function checkIfUserIsVerified(
    req: IAuthenticatedRequest<Partial<IUser>>,
    res: Response,
    next: NextFunction,
) {
    if (!req.user) {
        return res
            .status(401)
            .json({ message: "Unauthorized: You need to be logged in" });
    }
    if (!req.user?.isVerified === true) {
        return res
            .status(403)
            .json({ message: "Forbidden: User is not verified" });
    }
    next();
}

// Middleware to check if the token is revoked
export const checkRevokedToken = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.cookies.jwt_token;
    if (token && revokedTokens.has(token)) {
        return res
            .status(401)
            .json({ error: "Token is revoked: you need to login" });
    }
    next();
};
