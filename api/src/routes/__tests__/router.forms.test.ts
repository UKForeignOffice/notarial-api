import request from "supertest";
import { createServer } from "../../server";
import { testData } from "./router.test.data";
import * as queueService from "../../middlewares/services/QueueService";
jest.mock("../../middlewares/services/QueueService");
import { ApplicationError } from "../../ApplicationError";

let app;
beforeEach(() => {
  app = createServer();
});

describe("POST /forms", () => {
  it("should validate the payload", async () => {
    return await request(app)
      .post("/forms")
      .expect(400)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("VALIDATION");
      });
  });

  it("should respond a reference number", async () => {
    return await request(app)
      .post("/forms")
      .send(testData)
      .expect(200)
      .then((res) => expect(res.body).toStrictEqual({ reference: "DG19_IJVV6" }));
  });

  it("should respond with a queue error if sendToQueue failed", async () => {
    jest.spyOn(queueService.QueueService.prototype, "sendToQueue").mockRejectedValueOnce(new ApplicationError("QUEUE", "SES_PROCESS_ERROR", 500));
    await request(app)
      .post("/forms")
      .send(testData)
      .expect(500)
      .then((res) => expect(res.body.error).toStrictEqual("SES_PROCESS_ERROR"));

    jest.spyOn(queueService.QueueService.prototype, "sendToQueue").mockRejectedValueOnce(new ApplicationError("QUEUE", "NOTIFY_PROCESS_ERROR", 500));
    await request(app)
      .post("/forms")
      .send(testData)
      .expect(500)
      .then((res) => expect(res.body.error).toStrictEqual("NOTIFY_PROCESS_ERROR"));
  });
});
