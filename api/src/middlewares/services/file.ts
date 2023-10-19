import logger, { Logger } from "pino";
import axios from "axios";
import crypto from "crypto";
import config from "config";

export class FileService {
  logger: Logger;
  password: string;

  constructor() {
    this.logger = logger().child({ service: "File" });
    this.password = config.get("documentPassword");
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

  encryptFile(file: ArrayBuffer) {
    const hash = crypto.createHash("sha256");
    hash.update(this.password);
    const key = hash.digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-ocb", key, iv);
    const encryptedFile = cipher.update(new Uint8Array(file));
    cipher.final();
    return encryptedFile;
  }
}
