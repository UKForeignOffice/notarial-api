import { Router } from "express";
import * as emailHandlers from "../../handlers/email";

export const emailRouter = Router();

emailRouter.post("/affirmation", emailHandlers.affirmationPost);
emailRouter.post("/cni", emailHandlers.cniPost);
