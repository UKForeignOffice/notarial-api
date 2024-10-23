import { createMimeMessage, MIMEMessage } from "mimetext";
import config from "config";
import { FormField } from "../types";
import FileService from "./FileService";
import pino from "pino";

const fileService = new FileService();

const SENDER_NAME = config.get<string>("SES.Sender.name");
const SENDER_EMAIL_ADDRESS = config.get<string>("SES.Sender.emailAddress");
const RECIPIENT = config.get<string>("SES.Recipient.emailAddress");

const logger = pino().child({
  method: "SESEmail",
});

logger.info({ SENDER_NAME, SENDER_EMAIL_ADDRESS, RECIPIENT }, "SES emails configured");

export function createMessageWithText(subject: string, body: string) {
  const message = createMimeMessage();

  message.setSender({
    name: SENDER_NAME,
    addr: SENDER_EMAIL_ADDRESS,
  });
  message.setSubject(subject);

  message.addMessage({
    contentType: "text/html",
    data: body,
  });

  message.setRecipient(RECIPIENT);
  return message;
}

export async function attachFilesToMessage(attachments: FormField[], message: MIMEMessage) {
  for (const attachment of attachments) {
    const url = attachment.answer as string;
    const { contentType, data } = await fileService.getFile(url);
    message.addAttachment({
      filename: `${attachment.title}.${FileMimeType[contentType]}`,
      contentType,
      data: data.toString("base64"),
    });
  }
  return message;
}

export const FileMimeType = {
  "image/jpeg": "jpg",
  "application/pdf": "pdf",
  "image/png": "png",
  "application/vnd.oasis.opendocument.text": "odt",
};
