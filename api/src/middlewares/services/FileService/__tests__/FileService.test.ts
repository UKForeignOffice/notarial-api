import axios, { AxiosError, AxiosHeaders } from "axios";
import { FileService } from "../FileService";
import { ApplicationError } from "../../../../ApplicationError";

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

test("getFile returns a file not found response if the file cannot be found", () => {
  const spy = jest.spyOn(axios, "get");
  spy.mockRejectedValueOnce(
    new AxiosError(undefined, undefined, undefined, undefined, {
      data: {},
      status: 404,
      statusText: "File not found",
      headers: {},
      config: { headers: new AxiosHeaders() },
    })
  );
  expect(fileService.getFile("https://a-failing-url.com")).rejects.toThrow("Requested file could not be found");
});
