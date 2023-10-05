import {Express, Router} from "express";
import {ocrEmailRouter} from "./ocr-email/router";

const router = Router();

router.use("/ocr-email", ocrEmailRouter);
export function initRoutes(server: Express){
    server.use(router);
}