import { NextFunction, Request, Response } from "express";

export async function post(req: Request, res: Response, next: NextFunction) {
  const { submitService } = res.app.services;
  try {
    const { reference } = await submitService.submitForm(req.body);
    res.status(200).send({
      message: "Email sent successfully",
      reference,
    });
  } catch (e) {
    next(e);
    return;
  }
}
