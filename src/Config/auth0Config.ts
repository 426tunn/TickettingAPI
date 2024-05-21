import { auth } from 'express-openid-connect';
import { Config } from './config';


const config = {
    authRequired: false,
    auth0Logout: true,
    secret: Config.AUTH0_SECRET,
    baseURL: Config.AUTH0_BASE_URL,
    clientID: Config.AUTH0_CLIENT_ID,
    issuerBaseURL: Config.AUTH0_ISSUER_BASE_URL
};

export const auth0MW = auth(config);