import { Express, Router } from "express";
import { emailRouter } from "./email/router";

const router = Router();

router.use("/email", emailRouter);
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
