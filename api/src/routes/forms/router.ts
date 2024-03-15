import { Router } from "express";
import * as formsHandlers from "../../handlers/forms";
import * as staffEmailHandlers from "../../handlers/forms/emails/staff";
import * as userEmailHandlers from "../../handlers/forms/emails/user";
import { validationHandler } from "../../middlewares/validate";

export const formRouter = Router();

formRouter.post("/", validationHandler, formsHandlers.post);
formRouter.post("/emails/ses", staffEmailHandlers.validate, staffEmailHandlers.post);
formRouter.post("/emails/notify", userEmailHandlers.post);
