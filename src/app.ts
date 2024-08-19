// TODO: improve the entire error handling and logging capability
import { Config } from "./Config/config";
import { connectToDB } from "./database";
import app from "./index";
import { logger } from "./logging/logger";

connectToDB();
const PORT = Config.PORT;

app.listen(PORT, () => {
    logger.info(`listening on port ${PORT}`);
});
