import logger, { Logger } from "pino";
import axios, { AxiosError } from "axios";
import config from "config";
import { ApplicationError } from "../../../ApplicationError";

export class FileService {
  logger: Logger;
  password: string;

  constructor() {
    this.logger = logger().child({ service: "File" });
    this.password = config.get("documentPassword");
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
    } catch (e: AxiosError | Error | any) {
      throw this.handleFetchError(e);
    }
  }

  handleFetchError(err: AxiosError | Error) {
    if (err instanceof AxiosError) {
      if (err.status === 404) {
        return new ApplicationError("FILE", "NOT_FOUND", 500, "Requested file could not be found");
      }
      if (err.status === 500) {
        return new ApplicationError("FILE", "UNKNOWN", 500, err.message);
      }
    }
    return new ApplicationError("FILE", "UNKNOWN", 500, err.message);
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
