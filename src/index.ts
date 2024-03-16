import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
const passport = require("passport")
const rateLimit = require('express-rate-limit')
const helmet = require('helmet');
const logger = require('./logging/logger');
import userRoutes from './Routes/UserRoute';


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers 
})

app.use(helmet());
app.use(limiter)

app.use("/api/users", userRoutes)

app.get('/', (req, res) => {
    logger.info('WELCOME')
    res.status(200).send({
        message: 'Welcome!!'
    })
});

app.use((err : Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // console.log(err);
    res.status(500).json({
        error: err.message
    })
})


module.exports = app