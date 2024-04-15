import request from "supertest";
import { createServer } from "../../server";
import { userTestData } from "./router.test.data";
import * as queueService from "../../middlewares/services/QueueService";
jest.mock("../../middlewares/services/QueueService");
import { ApplicationError } from "../../ApplicationError";

let app;

beforeEach(() => {
  app = createServer();
});

describe("POST /forms/emails/notify", () => {
  it("should validate the payload", async () => {
    return await request(app)
      .post("/forms/emails/notify")
      .send({ test: "invalid payload" })
      .expect(400)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("PROCESS_VALIDATION");
      });
  });

  it("returns an error if queueing failed", async () => {
    jest.spyOn(queueService.QueueService.prototype, "sendToQueue").mockRejectedValueOnce(new ApplicationError("QUEUE", "NOTIFY_PROCESS_ERROR", 400));
    return await request(app)
      .post("/forms/emails/notify")
      .send(userTestData)
      .expect(400)
      .then((res) => {
        expect(res.body.error).toStrictEqual("NOTIFY_PROCESS_ERROR");
      });
  });

  it("should return a 200", async () => {
    return await request(app).post("/forms/emails/notify").send(userTestData).expect(200);
  });
});
