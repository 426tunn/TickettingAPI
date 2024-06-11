import { IUser } from "../Models/UserModel";
import { generateTokenWithRole } from "../Utils/authUtils";
import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        if (!req.user) {
            return res
                .status(401)
                .json({ message: "User authentication failed" });
        }
        const token = generateTokenWithRole(res, req.user as IUser);
        res.status(200).json({
            message: "Login Successful",
            token,
        });
    },
);

/**
 * @openapi
 * /auth/google:
 *   get:
 *     tags:
 *       - Google OAuth2
 *     summary: Initiate Google OAuth2 authentication
 *     description: Redirect to Google's OAuth2 page for authentication
 *     responses:
 *       302:
 *         description: Redirect to Google's OAuth2 page for authentication
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     tags:
 *       - Google OAuth2
 *     summary: Complete Google OAuth2 authentication
 *     description: Complete Google OAuth2 authentication and generate JWT token
 *     responses:
 *       200:
 *         description: JWT token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: User authentication failed
 *       500:
 *         description: Internal server error
 */

export { authRouter };
