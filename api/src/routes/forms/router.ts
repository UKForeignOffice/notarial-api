import { Router, Request, Response, NextFunction } from "express";
import * as formsHandlers from "../../handlers/forms";
import { validationHandler } from "../../middlewares/validate";
import { testData } from "../../middlewares/services/EmailService/__tests__/fixtures";

export const formRouter = Router();

formRouter.post("/", validationHandler, formsHandlers.post);
formRouter.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  const { submitService } = res.app.services;
  try {
    const { reference } = await submitService.submitForm(testData);
    res.status(200).send({
      message: "Emails sent successfully",
      reference,
    });
  } catch (e) {
    next(e);
    return;
  }
});
