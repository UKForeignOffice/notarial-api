import { Router } from "express";
import * as emailHandlers from "../../handlers/email";

export const emailRouter = Router();

emailRouter.post("/", emailHandlers.post);
