import { attachFilesToMessage } from "../SESEmail";
import { ApplicationError } from "../../../../utils/ApplicationError";

test("attachFilesToMessages throws an error when the answer is an invalid URL", async () => {
  function callAttachFilesToMessage() {
    return attachFilesToMessage(
      [
        {
          key: "deedPollFile",
          type: "file",
          title: "Deed poll",
          category: "nameChange",
        },
      ],
      {}
    );
  }
  expect(callAttachFilesToMessage).rejects.toStrictEqual(new ApplicationError("FILE", "URL_INVALID", "url: undefined was invalid"));
});
