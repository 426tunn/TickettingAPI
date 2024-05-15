import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserService } from "../Services/UserService";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { UserModel } from "../Models/UserModel";
// import bcrypt from "bcrypt";
import { Config } from "./config";

const userService = new UserService(UserModel);
const JWT_SECRET = Config.JWTSecret;

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
