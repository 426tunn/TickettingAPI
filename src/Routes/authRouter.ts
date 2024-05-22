import { IUser } from "../Models/UserModel";
import { generateTokenWithRole } from "../Utils/authUtils";
import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "User authentication failed" });
        }
        const token = generateTokenWithRole(res, req.user as IUser);
        res.status(200).json({
            message: "Login Successful",
            token,
        });
    }
);

export { authRouter };