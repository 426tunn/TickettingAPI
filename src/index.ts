import express from "express";
import { Config } from "./Config/config";
import passport from "passport";
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
import errorHandler from "./Middlewares/ErrorHandlingMiddleware";
import rateLimiter from "./Utils/rateLimiterUtils";
import crypto from "node:crypto";
import {
    TicketsOrderModel,
    TicketsOrderStatusEnum,
} from "./Models/TicketsOrderModel";

const SECRET = Config.SESSION_SECRET;
const app = express();

// security config and middlewares
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(rateLimiter);

// parse request body middlewares
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));

// swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// auth middlewares
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

// routes middlewares
app.use("/api/v1/users", checkRevokedToken, userRoutes);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1", notificationRouter);
app.use("/api/v1/tickets", authenticateJWT, checkRevokedToken, ticketRoutes);
app.use("/api/v1/ticket-types", eventTicketTypeRouter);
app.use("/api/v1/admin", authenticateJWT, checkIfUserIsAdmin, adminRouter);

app.get("/home", authenticateJWT, (_req, res) => {
    logger.info("WELCOME");
    res.status(200).send({
        message: "Welcome!!",
    });
});

//TODO: refactor into a service
app.post("/api/v1/ticket-payment-confirmation-webhook", async (req, res) => {
    const hash = crypto
        .createHmac("sha512", Config.PAYSTACK_PAYMENT_SECRET)
        .update(JSON.stringify(req.body))
        .digest("hex");
    if (hash !== req.headers["x-paystack-signature"]) {
        return res.status(401).json({ message: "Unknown data source" });
    }

    const event = req.body;
    const data = event.data;
    const ticketsOrder = await TicketsOrderModel.findOne({
        paymentReference: data?.reference,
    });

    if (!ticketsOrder) {
        return res.status(400).json({ message: "Invalid tickets order" });
    }

    if (event.event !== "charge.success") {
        return res.status(400).json({ message: "Payment unsuccessful" });
    }

    if (data.amount < ticketsOrder.totalPrice) {
        return res.status(400).json({ message: "Incomplete payment" });
    }

    await ticketsOrder.updateOne({
        status: TicketsOrderStatusEnum.paid,
    });
    return res.status(200).json({ message: "Success" });
});

app.use(errorHandler);

export default app;
