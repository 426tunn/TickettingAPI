import { log } from "winston";
import { Config } from "./envConfig/config";
const app = require('./index');
// const {connectToDB} = require('./database/db');
const logger = require('./logging/logger');


const PORT = Config.PORT;
// connectToDB();

app.listen(PORT, ()=>{
 logger.info(`Server running at PORT: ${PORT}`)
})

