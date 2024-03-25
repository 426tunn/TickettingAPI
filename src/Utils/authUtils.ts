import jwt from 'jsonwebtoken';
import { Config } from 'Config/config';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export function generateTokenWithRole(user: any, role: string) {
    const payload = {
        user: user,
        role: role
    };

    const token = jwt.sign(payload, Config.JWTSecret, { expiresIn: '1h' });
    return token;
}




// Middleware function to authenticate the user using JWT
export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', { session: false }, (err: Error, user: any) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    })(req, res, next);
}
