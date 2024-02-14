import { NotifyEmailTemplate } from "../../types";
import { buildUserConfirmationPersonalisation } from "./personalisationBuilder.userConfirmation";
import { buildPostNotificationPersonalisation } from "./personalisationBuilder.postNotification";

export const PersonalisationBuilder: Record<NotifyEmailTemplate, typeof buildPostNotificationPersonalisation | typeof buildUserConfirmationPersonalisation> = {
  /**
   * Email to send to a post, mentioning that there is a new form to process.
   */
  postNotification: buildPostNotificationPersonalisation,

  /**
   * Confirmation email for the user, detailing how to book, what to bring etc.
   */
  userConfirmation: buildUserConfirmationPersonalisation,
};
