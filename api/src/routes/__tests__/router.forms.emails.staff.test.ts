import request from "supertest";
import { createServer } from "../../server";
import { sesTestData } from "./router.test.data";
import * as queueService from "../../middlewares/services/QueueService";
jest.mock("../../middlewares/services/QueueService");
import { ApplicationError } from "../../ApplicationError";

let app;

beforeEach(() => {
  app = createServer();
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
