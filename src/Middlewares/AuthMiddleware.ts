import { UserRole } from '../Enums/UserRole';
import { IUser } from 'Models/UserModel';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', { session: false }, (err: Error, user: IUser) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    })(req, res, next);
}

export function isAdminMiddleware(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', { session: false }, (err: Error, user: IUser) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const adminRoles = [UserRole.Admin, UserRole.SuperAdmin];
        const userIsAdmin = adminRoles.includes(user?.role)
        if (!userIsAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        next();
    })(req, res, next);
}
