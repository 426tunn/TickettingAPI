import express from "express";
import { Config } from "./Config/config";
import passport from "passport";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { logger } from "./logging/logger";
import session from "express-session";
import userRoutes from "./Routes/UserRoute";
import eventRoutes from "./Routes/EventRoute";
import ticketRoutes from "./Routes/TicketRoute";
import adminRouter from "./Routes/adminRouter";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./Config/swaggerConfig";
import { authenticateJWT } from "./Utils/authUtils";
import {
    checkIfUserIsAdmin,
    checkRevokedToken,
} from "./Middlewares/AuthMiddleware";
import cookieParser from "cookie-parser";
import eventTicketTypeRouter from "./Routes/EventTicketTypeRoute";
import cors from "cors";
import { authRouter } from "./Routes/authRouter";
import bodyParser from "body-parser";
import { notificationRouter } from "./Routes/NotificationRouter";
import "./Config/PassportConfig";

const SECRET = Config.SESSION_SECRET;
const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(helmet());
app.use(limiter);

app.use(
    session({
        secret: SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, httpOnly: true, maxAge: 3600000 },
    }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use("/api/v1/users", checkRevokedToken, userRoutes);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1", notificationRouter);
app.use("/api/v1/tickets", authenticateJWT, ticketRoutes);
app.use("/api/v1/ticket-types", eventTicketTypeRouter);
app.use("/api/v1/admin", authenticateJWT, checkIfUserIsAdmin, adminRouter);

app.get("/home", authenticateJWT, (_req, res) => {
    logger.info("WELCOME");
    res.status(200).send({
        message: "Welcome!!",
    });
});

app.use(
    (
        err: Error,
        _req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) => {
        res.status(500).json({
            error: err.message,
        });
        next(err);
    },
);

export default app;
