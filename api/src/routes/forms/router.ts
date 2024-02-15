import { Router } from "express";
import * as formsHandlers from "../../handlers/forms";
import { validationHandler } from "../../middlewares/validate";

export const formRouter = Router();

formRouter.post("/", validationHandler, formsHandlers.post);
