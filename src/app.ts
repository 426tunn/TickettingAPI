import { Config } from "./envConfig/config";
import { connectToDB } from "./database";
const app = require('./index');
const logger = require('./logging/logger');


connectToDB();
const PORT = Config.PORT;

app.listen(PORT, ()=>{
 logger.info(`Server running at PORT: ${PORT}`)
})

