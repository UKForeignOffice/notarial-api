import { Router } from "express";
import * as formsHandlers from "../../handlers/forms";
import * as staffEmailHandlers from "../../handlers/forms/emails/staff";
import { validationHandler } from "../../middlewares/validate";

export const formRouter = Router();

formRouter.post("/", validationHandler, formsHandlers.post);
formRouter.post("/emails/staff", staffEmailHandlers.validate, staffEmailHandlers.post);
console.log("");
// formRouter.post("/emails/user", formsHandlers.postNotifications);
