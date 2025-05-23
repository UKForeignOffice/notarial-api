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

test("createMessageWithText returns valid raw email", async () => {
  const message = await createMessageWithText("Register your favourite egg", "Favourite egg: Scrambled");
  const email = message.asRaw();
  expect(email.includes("Date:")).toBeTruthy();
  expect(email.includes("From:")).toBeTruthy();
  expect(email.includes("Message-ID")).toBeTruthy();
});

test("attachFilesToMessage returns valid raw email with images", async () => {
  const message = await createMessageWithText("Register your favourite egg", "Favourite egg: Scrambled");

  await attachFilesToMessage(
      [
        {
          answer: "https://some-url.com/123",
          key: "favouriteEgg",
          title: "Favourite egg",
          type: "file",
        },
      ],
      message
  );

  const email = message.asRaw();

  expect(email.includes('Content-Type: application/pdf; name="Favourite egg.pdf"')).toBeTruthy();
  expect(email.includes('Content-Disposition: attachment; filename="Favourite egg.pdf"')).toBeTruthy();
});
