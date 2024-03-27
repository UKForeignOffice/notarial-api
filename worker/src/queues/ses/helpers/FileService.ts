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

  validateFileLocation(urlToValidate: string): boolean {
    let url: URL;
    try {
      url = new URL(urlToValidate);
    } catch (e) {
      this.logger.error(`url ${urlToValidate} is not a valid URL`);
    }
    // @ts-ignore
    return this.allowedOrigins.includes(url.origin);
  }

  /**
   * returns the contentype and
   * @param url of the file you need to retrieve
   *
   */
  async getFile(url: string): Promise<{ contentType: string; data: Buffer }> {
    const isValid = this.validateFileLocation(url);
    if (!isValid) {
      throw new ApplicationError("FILE", "ORIGIN_NOT_ALLOWED", `The specified file location ${url} is forbidden`);
    }
    try {
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
      throw new ApplicationError("FILE", "UNKNOWN", err.message);
    }
  }
}
