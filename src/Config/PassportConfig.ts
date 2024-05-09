import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserService } from "../Services/UserService";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as Auth0Strategy } from 'passport-auth0';
import { UserModel } from "../Models/UserModel";
// import bcrypt from "bcrypt";
import { Config } from "./config";

const userService = new UserService(UserModel);
const JWT_SECRET = Config.JWTSecret;
const auth0Config = {
    domain: Config.AUTH0_DOMAIN,
    clientID: Config.AUTH0_CLIENT_ID,
    clientSecret: Config.AUTH0_CLIENT_SECRET,
    callbackURL: Config.AUTH0_CALLBACK_URL,
}
passport.use(
    "auth0",
    new Auth0Strategy(
        auth0Config, 
        async (accessToken, refreshToken, extraParams, profile, done) => {
        try {
            let user = await userService.getUserByEmail(profile.emails && profile.emails[0].value);
        
            if (!user) {
                user = await UserModel.create({
                    auth0Id: profile.id,
                    username: profile.displayName || profile.username || 'Anonymous',
                    firstname: profile.name.givenName || '',
                    lastname: profile.name.familyName || '',
                    email: profile.emails && profile.emails[0].value,
                });
            }

                // Return the user to Passport
            return done(null, user);
        } catch (error) {
        // If an error occurs, pass it to Passport
        return done(error);
        }
}));

passport.use(
    "jwt",
    new JWTStrategy(
        {
            secretOrKey: JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        async (payload, done) => {
            try {
                delete payload.user.password;
                return done(null, payload.user); //it does 'req.user = payload.user
            } catch (error) {
                done(error);
            }
        },
    ),
);

passport.use(
    "login",
    new LocalStrategy(
        {
            usernameField: "usernameOrEmail",
            passwordField: "password",
        },
        async (usernameOrEmail, password, done) => {
            try {
                let user;
                if (usernameOrEmail.includes("@")) {
                    user = await userService.getUserByEmail(usernameOrEmail);
                } else {
                    user = await userService.getUserByUsername(usernameOrEmail);
                }
                if (!user) {
                    return done(null, false, {
                        message: "Invalid username or email",
                    });
                }
                const isPasswordValid = await user.isValidPassword(password);
                if (!isPasswordValid) {
                    return done(null, false);
                }
                return done(null, user, {
                    message: "User logged in successfully",
                });
            } catch (error) {
                return done(error);
            }
        },
    ),
);

passport.use(
    "register",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        async (req, username, password, done) => {
            try {
                const { username, firstname, lastname, email, password } =
                    req.body;
                // const hashedPassword = await bcrypt.hash(password, 10);
                const user = await userService.createUser(
                    username,
                    firstname,
                    lastname,
                    email,
                    password,
                );
                // delete user.password;
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        },
    ),
);
