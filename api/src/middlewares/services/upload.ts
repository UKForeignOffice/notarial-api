import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import config from "config";
import logger, { Logger } from "pino";

export class S3Service {
  bucketName: string;
  client: S3Client;
  logger: Logger;

  constructor() {
    this.bucketName = config.get("s3Bucket");
    this.client = new S3Client({});
    this.logger = logger().child({ service: "S3" });
  }

  async getObject(url: string): Promise<Uint8Array | void> {
    try {
      if (!this.bucketName) {
        this.logger.error(["S001"], "No bucket name has been set");
        return;
      }
      const objectName = url.split("/").at(-1);

      const fileRes = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: objectName,
        })
      );

      if (!fileRes.Body) {
        this.logger.error(["S002"], "File could not be found");
        return;
      }

      return await fileRes.Body.transformToByteArray();
    } catch (e) {
      this.logger.error(["S003"], `Unknown error: ${(e as Error).message}`);
      return;
    }
  }
}
