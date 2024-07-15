import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserService } from "../Services/UserService";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { IUser, UserModel } from "../Models/UserModel";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Config } from "./config";

const userService = new UserService(UserModel);
const JWT_SECRET = Config.JWTSecret;
const cookieExtractor = (req: Request) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["jwt_token"];
    }
    return token;
};

passport.use(
    "jwt",
    new JWTStrategy(
        {
            secretOrKey: JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromExtractors([
                cookieExtractor,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
        },
        async (payload, done) => {
            try {
                // delete payload.user.password;
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
                    const isEmailMatch =
                        user.authenticateEmail(usernameOrEmail);
                    if (!isEmailMatch) {
                        return done(null, false, {
                            message: "Invalid email",
                        });
                    }
                } else {
                    user = await userService.getUserByUsername(usernameOrEmail);
                    const isMatchUsername =
                        user.authenticateUsername(usernameOrEmail);
                    if (!isMatchUsername) {
                        return done(null, false, {
                            message: "Invalid username",
                        });
                    }
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

passport.use(
    new GoogleStrategy(
        {
            clientID: Config.GOOGLE_CLIENT_ID,
            clientSecret: Config.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:4201/api/v1/auth/google/callback",
        },
        async (token, tokenSecret, profile, done) => {
            try {
                let user = await userService.getUserByGoogleId(profile.id);
                if (!user) {
                    user = await userService.createUserWithGoogle(profile);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        },
    ),
);

passport.serializeUser(
    (user: IUser, done: (err: Error | null, id?: string) => void) => {
        done(null, user.id);
    },
);

passport.deserializeUser(
    async (id: string, done: (err: Error | null, user?: IUser) => void) => {
        try {
            const user = await userService.getUserById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    },
);
