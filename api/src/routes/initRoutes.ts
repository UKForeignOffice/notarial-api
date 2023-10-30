import { Express, Router } from "express";
import { formRouter } from "./forms/router";
import { ApplicationError } from "../ApplicationError";

const router = Router();

router.use("/forms", formRouter);
router.get("/health-check", (_req, res) => {
  throw new ApplicationError(
    "ses",
    "TEMPLATE_NOT_FOUND",
    500,
    "some custom message"
  );

  // res.send({
  //   uptime: process.uptime(),
  //   message: "OK",
  //   timestamp: Date.now(),
  // });
});
export function initRoutes(server: Express) {
  server.use(router);
}
