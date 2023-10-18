import logger, { Logger } from "pino";
import axios from "axios";

export class FileService {
  logger: Logger;

  constructor() {
    this.logger = logger().child({ service: "File" });
  }

  async getFile(url: string): Promise<ArrayBuffer | void> {
    try {
      const fileRes = await axios.get(url);

      if (!fileRes.data) {
        this.logger.error(["F001"], "File could not be found");
        return;
      }

      return await (fileRes.data as Blob).arrayBuffer();
    } catch (e) {
      this.logger.error(["F002"], `Unknown error: ${(e as Error).message}`);
      return;
    }
  }
}
