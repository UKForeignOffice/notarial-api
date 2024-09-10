import { Router } from "express";
import * as formsHandlers from "../../handlers/forms";
import * as caseEmailHandlers from "../../handlers/forms/emails/case";
import * as userEmailHandlers from "../../handlers/forms/emails/user";
import { validationHandler } from "../../middlewares/validate";

export const formRouter = Router();

formRouter.post("/", validationHandler, formsHandlers.post);
formRouter.post("/emails/ses", caseEmailHandlers.validate, caseEmailHandlers.post);
formRouter.post("/emails/notify", userEmailHandlers.validate, userEmailHandlers.post);
