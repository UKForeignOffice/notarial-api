import { sesSendHandler } from "../sesSendHandler";
import { ApplicationError } from "../../../../utils/ApplicationError";

test("sesSendHandler throws an File application error if attachments are empty", async () => {
  expect(
    sesSendHandler({
      data: {
        attachments: [{}],
      },
    })
  ).rejects.toEqual(new ApplicationError("FILE", "URL_INVALID", "url: undefined was invalid"));
});
