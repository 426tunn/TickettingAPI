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


export function checkIfUserIsAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if ((req.user as IUser).role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}
