import { Express, Router } from "express";
import { ocrEmailRouter } from "./ocr-email/router";
import { logger } from "../services";

const router = Router();

router.use("/ocr-email", ocrEmailRouter);
router.get("/health-check", (_req, res) => {
  try {
    res.send({
      uptime: process.uptime(),
      message: "OK",
      timestamp: Date.now(),
    });
  } catch (e) {
    logger.error(["Health check error"], (e as Error).message);
    res.status(500).send(e);
  }
});
export function initRoutes(server: Express) {
  server.use(router);
}
