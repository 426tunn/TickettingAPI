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


// Function to generate a secure password that meets the validation criteria
 export function generateSecurePassword() {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const uppercaseCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberCharset = "0123456789";

    let password = "";
    // Ensure at least one uppercase letter
    password += uppercaseCharset[Math.floor(Math.random() * uppercaseCharset.length)];
    // Ensure at least one number
    password += numberCharset[Math.floor(Math.random() * numberCharset.length)];
    
    // Fill the rest of the password length with random characters
    for (let i = 2; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }

    return password;
}


export function isEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
