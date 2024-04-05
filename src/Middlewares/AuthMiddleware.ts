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
    if (
        req.user?.role !== "admin" &&
        req.user?.role !== "superadmin"
    ) {
        return res
            .status(403)
            .json({ message: "Forbidden: User is not an admin" });
    }
    next();
}

export function checkIfUserIsSuperAdmin(
    req: IAuthenticatedRequest<Partial<IUser>>,
    res: Response,
    next: NextFunction,
) {
    if (!req.user) {
        return res
            .status(401)
            .json({ message: "Unauthorized: You need to be logged in" });
    }

    if (req?.user?.role !== "superadmin") {
        return res
            .status(403)
            .json({ message: "Forbidden: User is not a super admin" });
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
