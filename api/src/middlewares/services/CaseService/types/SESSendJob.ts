// TODO:- share this type between worker and api
import { NotifySendEmailArgs } from "../../utils/types";
import { FormField } from "../../../../types/FormField";

export type SESSendJob = {
  subject: string;
  body: string;
  attachments: FormField[];
  reference: string;
  onComplete?: {
    queue: string;
    job?: SESSendJob | NotifySendEmailArgs;
  };
};
