import { Express, Router } from "express";
import { formRouter } from "./forms/router";

const router = Router();

router.use("/forms", formRouter);

// TODO: remove
router.use("/ocr-email", formRouter);

router.get("/health-check", (_req, res) => {
  res.send({
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  });
});
export function initRoutes(server: Express) {
  server.use(router);
}
