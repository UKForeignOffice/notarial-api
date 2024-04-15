import request from "supertest";
import { createServer } from "../../server";
import { testData, sesTestData, userTestData } from "./router.test.data";
const app = createServer();
import * as queueService from "../../middlewares/services/QueueService";
jest.mock("../../middlewares/services/QueueService");
import { ApplicationError } from "../../ApplicationError";

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
    jest.spyOn(queueService.QueueService.prototype, "sendToQueue").mockRejectedValueOnce(new ApplicationError("QUEUE", "SES_PROCESS_ERROR", 400));
    return await request(app)
      .post("/forms")
      .send(testData)
      .expect(500)
      .then((res) => expect(res.body.error).toStrictEqual("QUEUE_ERROR"));
  });
});

describe("POST /forms/emails/ses", () => {
  it("should validate the payload", async () => {
    return await request(app)
      .post("/forms/emails/ses")
      .expect(400)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("VALIDATION");
      });
  });

  it("returns an error if queueing failed", async () => {
    jest.spyOn(queueService.QueueService.prototype, "sendToQueue").mockRejectedValueOnce(new ApplicationError("QUEUE", "SES_PROCESS_ERROR", 400));
    return await request(app)
      .post("/forms/emails/ses")
      .send(sesTestData)
      .expect(400)
      .then((res) => {
        expect(res.body.error).toStrictEqual("SES_SEND_ERROR");
      });
  });

  it("should return a 200", async () => {
    return await request(app).post("/forms/emails/ses").send(sesTestData).expect(200);
  });
});

describe("POST /forms/emails/notify", () => {
  it("should validate the payload", async () => {
    return await request(app)
      .post("/forms/emails/notify")
      .send({ test: "invalid payload" })
      .expect(400)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("VALIDATION");
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
