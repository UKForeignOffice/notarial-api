import axios from "axios";
import FileService from "../FileService";

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

test("getFile returns an error when the file content cannot be found", async () => {
  (axios.get as jest.Mock).mockRejectedValueOnce({
    response: {
      status: 404,
      config: {
        url: "https://some-url.com",
      },
    },
  });

  try {
    await fileService.getFile("https://some-url.com");
  } catch (e) {
    expect(e.name).toBe("FILE");
    expect(e.message).toBe("Requested file could not be found at https://some-url.com");
  }
});

test("getFile returns an error when the API responds with a 500", async () => {
  (axios.get as jest.Mock).mockRejectedValueOnce({
    response: {
      status: 500,
      config: {
        url: "https://some-url.com",
      },
    },
  });

  try {
    await fileService.getFile("https://some-url.com");
  } catch (e) {
    expect(e.name).toBe("FILE");
    expect(e.code).toBe("UNKNOWN");
  }
});

test("validateFileLocation returns the fileService instance if the specified URL is from an allowed origin", () => {
  expect(() => {
    fileService.validateFileLocation("https://some-url.com");
  }).not.toThrow();
});
test("validateFileLocation throws when the specified URL is not in the list of allowed origins", () => {
  try {
    fileService.validateFileLocation("https://a-failing-url.com");
  } catch (e) {
    expect(e.name).toBe("FILE");
    expect(e.code).toBe("ORIGIN_NOT_ALLOWED");
  }
});

test("validateFileLocation throws when an invalid url is passed", () => {
  try {
    fileService.validateFileLocation("/a-failing-url");
  } catch (e) {
    expect(e.name).toBe("FILE");
    expect(e.code).toBe("ORIGIN_NOT_ALLOWED");
  }
});

test("validateFileLocation checks origin only", () => {
  expect(() => {
    fileService.validateFileLocation("https://a-failing-url.com?param=https://some-url.com");
  }).toThrow();
});
