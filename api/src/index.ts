import {createServer} from "./server";
import config from "./initConfig";
import {logger} from "./services";

async function initApp(): Promise<void> {
    const server = createServer();

    server.listen(config.get("port"), () => {
        logger.info(`Server listening on PORT: ${config.get("port")}, NODE_ENV: ${config.get("env")}`)
    });

    process.on("exit", () => {
        logger.info(`Server stopped`);
    });
}

initApp().catch((err) => {
    logger.error(["Server initialisation error"], err);
    process.exit(1);
})