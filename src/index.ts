import express from "express";
import { Config } from "./Config/config";
import passport from "passport";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { logger } from "./logging/logger";
import session from "express-session";
import userRoutes from "./Routes/UserRoute";
import eventRoutes from "./Routes/EventRoute";
import { authenticateJWT } from "./Utils/authUtils";
import "./Config/PassportConfig";
import eventVenueRouter from "./Routes/EventVenueRoute";

const SECRET = Config.SESSION_SECRET;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(helmet());
app.use(limiter);

app.use(
    session({
        secret: SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 3600000 },
    }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", authenticateJWT, eventRoutes);
app.use("/api/v1/event-venues", eventVenueRouter);

app.get("/", (req, res) => {
    logger.info("WELCOME");
    res.status(200).send({
        message: "Welcome!!",
    });
});

app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) => {
        // console.log(err);
        res.status(500).json({
            error: err.message,
        });
    },
);

export default app;
