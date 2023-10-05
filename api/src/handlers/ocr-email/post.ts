import { Request, Response } from "express";

export async function post(_req: Request, res: Response) {
  res.status(200).send("Request successful");
}
