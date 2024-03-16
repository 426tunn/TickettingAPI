import { Config } from "./Config/config";
import { connectToDB } from "./database";
const app = require('./index');
const logger = require('./logging/logger');


connectToDB();
const PORT = Config.PORT;

app.listen(PORT, ()=>{
 logger.info(`Serverissss running at PORT: ${PORT}`)
})

