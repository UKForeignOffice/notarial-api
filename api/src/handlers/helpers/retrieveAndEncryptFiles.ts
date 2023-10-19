import { InputFields } from "./getAllInputsFromForm";
import { FileService } from "../../middlewares/services";
import { MailAttachments } from "../../types/MailAttachments";

export async function retrieveAndEncryptFiles(
  uploadFields: InputFields,
  fileService: FileService
): Promise<MailAttachments> {
  const filePromises = Object.values(uploadFields).map(async (url) => {
    if (!url) {
      return;
    }
    return new Promise(async (resolve, reject) => {
      const file = await fileService.getFile(url as string);
      if (!file) {
        reject(`No file found at url ${url}`);
      }
      resolve(fileService.encryptFile(file as ArrayBuffer));
    });
  });
  const files = await Promise.all(filePromises);
  return Object.keys(uploadFields).reduce(
    (acc, currentKey, currentIndex) => ({
      ...acc,
      [currentKey]: files[currentIndex],
    }),
    {}
  );
}
