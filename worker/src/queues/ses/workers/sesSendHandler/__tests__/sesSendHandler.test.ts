import { ApplicationError } from "../../../../../utils/ApplicationError";
import * as sesSendHelper from "../sendAlertToPost";
import * as sesSend from "../sesSendHandler";

jest.mock("../../../../../Consumer", () => ({
  __esModule: true,
  getConsumer: jest.fn().mockResolvedValue({
    send: jest.fn(),
  }),
}));

jest.mock("../../../helpers/sesClient", () => ({
  __esModule: true,
  sesClient: {
    send: jest.fn().mockResolvedValue({ MessageId: "abc-def" }),
  },
}));

jest.mock("./../sendAlertToPost");

test("sesSendHandler throws an File application error if attachments are empty", async () => {
  expect(
    sesSend.sesSendHandler([
      {
        data: {
          attachments: [{}],
        },
      },
    ])
  ).rejects.toEqual(new ApplicationError("FILE", "URL_INVALID", "url: undefined was invalid"));
});

test("sesSendHandler calls sendAlertToPost", async () => {
  const job = {
    id: "job-id",
    name: "SES_SEND",
    data: {
      attachments: [],
      body: "",
      onComplete: {
        job: {
          emailAddress: "",
          options: {
            reference: "ref",
            personalisation: {
              reference: "ref",
            },
          },
          template: "template-id",
        },
        queue: "NOTIFY_SEND",
      },
      reference: "ref",
      subject: "",
    },
  };
  await sesSend.sesSendHandler([job]);
  expect(sesSendHelper.sendAlertToPost).toHaveBeenCalled();
  expect(sesSendHelper.sendAlertToPost).toBeCalledWith("job-id", job.data.onComplete);
});
