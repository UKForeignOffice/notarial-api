import { attachFilesToMessage, createMessageWithText } from "../SESEmail";
import "./../FileService";
const fileServiceMock = {
  validateFileLocation(_url: string) {
    return;
  },
  async getFile() {
    const fileBuffer = Buffer.from("test file");
    return {
      contentType: "application/pdf",
      data: fileBuffer,
    };
  },
};

jest.mock("./../FileService", () => {
  return jest.fn().mockImplementation(() => fileServiceMock);
});

test("createMessageWithText returns valid raw email", () => {
  const message = createMessageWithText("Register your favourite egg", "Favourite egg: Scrambled");
  const email = message.asRaw();
  expect(email.includes("Date:")).toBeTruthy();
  expect(email.includes("From:")).toBeTruthy();
  expect(email.includes("Message-ID")).toBeTruthy();
});
