import logger, { Logger } from "pino";
import axios, { AxiosError } from "axios";
import config from "config";
import { ERRORS } from "../../errors";

export class FileService {
  logger: Logger;
  password: string;

  constructor() {
    this.logger = logger().child({ service: "File" });
    this.password = config.get("documentPassword");
  }

  async getFile(url: string): Promise<Blob> {
    const fileRes = await axios.get(url).catch(this.handleFetchError);

    if (!fileRes?.data) {
      this.logger.error(ERRORS.file.EMPTY_RES);
    }

    return await (fileRes?.data as Blob);
  }

  handleFetchError(err: Error | AxiosError) {
    if ("response" in err && err.response) {
      if (err.response.status === 404) {
        // throw new HttpException(500, "500", ERRORS.file.NOT_FOUND);
      }
      if (err.response.status === 500) {
        // throw new HttpException(500, "500", ERRORS.file.API_ERROR);
      }
    }
    throw new Error(err.message);
  }

  // encryptFile(file: ArrayBuffer) {
  //   const hash = crypto.createHash("sha256");
  //   hash.update(this.password);
  //   const key = hash.digest();
  //   const iv = crypto.randomBytes(16);
  //   const cipher = crypto.createCipheriv("aes-256-ocb", key, iv);
  //   const encryptedFile = cipher.update(new Uint8Array(file));
  //   cipher.final();
  //   return encryptedFile;
  // }
}
