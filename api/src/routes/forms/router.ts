import { Router } from "express";
import * as formsHandlers from "../../handlers/forms";

export const formRouter = Router();

formRouter.post("/", formsHandlers.post);
