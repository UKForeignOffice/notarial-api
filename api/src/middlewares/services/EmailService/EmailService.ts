import { FormField } from "../../../types/FormField";

export interface EmailService {
  sendEmail: (message: string) => Promise<any>;
  buildEmailWithAttachments: (params: { subject: string; body: string; attachments: FormField[] }) => Promise<string>;
  buildOathEmailBody: (fields: FormField[]) => string;
  buildCNIEmailBody: () => void;
}
