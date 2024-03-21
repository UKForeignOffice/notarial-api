import logger, { Logger } from "pino";
import axios, { AxiosError } from "axios";
import { ApplicationError } from "../../../utils/ApplicationError";
import config from "config";

export default class FileService {
  logger: Logger;
  allowedOrigins: string[];

  constructor() {
    this.logger = logger().child({ service: "File" });
    this.allowedOrigins = config.get<string[]>("Files.allowedOrigins");
  }

  validateFileLocation(url: string): void {
    try {
      const urlObject = new URL(url);
      const isAllowed = this.allowedOrigins.includes(urlObject.origin);
      if (!isAllowed) {
        throw "";
      }
    } catch (e) {
      throw new ApplicationError("FILE", "ORIGIN_NOT_ALLOWED", `The specified file location ${url} is forbidden`);
    }
  }

  /**
   * returns the contentype and
   * @param url of the file you need to retrieve
   *
   */
  async getFile(url: string): Promise<{ contentType: string; data: Buffer }> {
    try {
      this.validateFileLocation(url);
      const { headers, data } = await axios.get<Buffer>(url, { responseType: "arraybuffer", responseEncoding: "base64" });
      return {
        contentType: headers["content-type"],
        data,
      };
    } catch (err: AxiosError | Error | any) {
      this.logger.error({ err }, "Fetching files failed");
      if (err.response) {
        if (err.response.status === 404) {
          throw new ApplicationError("FILE", "NOT_FOUND", `Requested file could not be found at ${err.response?.config.url}`);
        }
      }
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError("FILE", "UNKNOWN", err.message);
    }
  }
}
