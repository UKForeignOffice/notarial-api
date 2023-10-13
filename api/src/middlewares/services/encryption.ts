import config from "config";
import * as crypto from "crypto";

export class EncryptionService {
  password: string;

  constructor() {
    this.password = config.get("documentPassword");
  }

  encryptFile(file: Uint8Array) {
    const hash = crypto.createHash("sha256");
    hash.update(this.password);
    const key = hash.digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-ocb", key, iv);
    const encryptedFile = cipher.update(file);
    cipher.final();
    return encryptedFile;
  }
}
