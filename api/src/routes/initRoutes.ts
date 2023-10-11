import { Express, Router } from "express";
import { ocrEmailRouter } from "./ocr-email/router";
import { logger } from "../services";

const router = Router();

router.use("/ocr-email", ocrEmailRouter);
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
