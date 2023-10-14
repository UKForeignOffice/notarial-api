import config from "config";
import logger, { Logger } from "pino";
import axios from "axios";

export class UploadService {
  bucketName: string;
  logger: Logger;

  constructor() {
    this.bucketName = config.get("s3Bucket");
    this.logger = logger().child({ service: "S3" });
  }

  async getObject(url: string): Promise<ArrayBuffer | void> {
    try {
      if (!this.bucketName) {
        this.logger.error(["S001"], "No bucket name has been set");
        return;
      }

      const fileRes = await axios.get(url);

      if (!fileRes.data) {
        this.logger.error(["S002"], "File could not be found");
        return;
      }

      return await (fileRes.data as Blob).arrayBuffer();
    } catch (e) {
      this.logger.error(["S003"], `Unknown error: ${(e as Error).message}`);
      return;
    }
  }
}
