import jwt from 'jsonwebtoken';
import { Config } from '../Config/config';


export function generateTokenWithRole(user: any, role: string) {
    const payload = {
        user: user,
        role: role
    };

    const token = jwt.sign(payload, Config.JWTSecret, { expiresIn: '1h' });
    return token;
}

export function isEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
