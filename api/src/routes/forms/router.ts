import { NextFunction, Router } from "express";
import * as formsHandlers from "../../handlers/forms";
import * as staffEmailHandlers from "../../handlers/forms/emails/ses";
import * as notifyEmailHandlers from "../../handlers/forms/emails/notify";
import { validationHandler } from "../../middlewares/validate";

export const formRouter = Router();

formRouter.post("/", validationHandler, formsHandlers.post);
formRouter.post("/emails/ses", staffEmailHandlers.validate, staffEmailHandlers.post);
formRouter.post("/emails/notify", notifyEmailHandlers.post);
