// TODO: create types for variables, functions, parameters etc in one place
import { Config } from "./Config/config";
import { connectToDB } from "./database";
import app from "./index";
import { logger } from "./logging/logger";

connectToDB();
const PORT = Config.PORT;

app.listen(PORT, () => {
    logger.info(`Serverissss running at PORT: ${PORT}`);
});
