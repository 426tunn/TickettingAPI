// import { auth } from 'express-openid-connect';
import { Config } from "./config";


// const config = {
//   authRequired: false,
//   auth0Logout: true,
//   secret:  Config.AUTH0_SECRET,
//   clientID: Config.AUTH0_CLIENT_ID,
//   issuerBaseURL: Config.AUTH0_ISSUER_BASE_URL
// };

const auth0Config = {
  domain: Config.AUTH0_DOMAIN,
  clientID: Config.AUTH0_CLIENT_ID,
  clientSecret: Config.AUTH0_CLIENT_SECRET,
  callbackURL: Config.AUTH0_CALLBACK_URL
};
module.exports = auth0Config;