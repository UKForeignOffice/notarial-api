import express, {Express} from "express";
import {initRoutes} from "./routes/initRoutes";

const server = express();
export function createServer(): Express {
    initRoutes(server);

    return server
}