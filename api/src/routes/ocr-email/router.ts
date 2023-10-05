import {Router} from "express";
import * as ocrEmailHandlers from "../../handlers/ocr-email";

export const ocrEmailRouter = Router();

ocrEmailRouter.post("/", ocrEmailHandlers.post);