import axios from "axios";
import { FileService } from "../FileService";
import { ApplicationError } from "../../../../utils/ApplicationError";

jest.mock("axios");

const fileService = new FileService();

test("getFile returns the file type and file content when a file is found", async () => {
  const fileBuffer = Buffer.from("test file");
  (axios.get as jest.Mock).mockResolvedValueOnce({
    headers: {
      "content-type": "application/pdf",
    },
    data: fileBuffer,
  });
  const result = await fileService.getFile("https://some-url.com");
  expect(result).toEqual({
    contentType: "application/pdf",
    data: fileBuffer,
  });
});

test("getFile returns an error when the file content cannot be found", () => {
  (axios.get as jest.Mock).mockRejectedValueOnce({
    status: 404,
  });
  expect(fileService.getFile("https://a-failing-url.com")).rejects.toThrowError(ApplicationError);
});
