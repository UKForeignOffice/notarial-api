import logger, { Logger } from "pino";
import axios, { AxiosError } from "axios";
import { ApplicationError } from "../../../utils/ApplicationError";

export default class FileService {
  logger: Logger;

  constructor() {
    this.logger = logger().child({ service: "File" });
  }

  /**
   * returns the contentype and
   * @param url of the file you need to retrieve
   *
   */
  async getFile(url: string): Promise<{ contentType: string; data: Buffer }> {
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
        if (err.response.status === 500) {
          throw new ApplicationError("FILE", "UNKNOWN", err.message);
        }
      }
      throw new ApplicationError("FILE", "UNKNOWN", err.message);
    }
  }
}
