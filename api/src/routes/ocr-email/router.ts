import {Router} from "express";
import {ocrEmailController} from "../../controllers/ocrEmail";

export const ocrEmailRouter = Router();

ocrEmailRouter.post("/ocr-email", ocrEmailController);