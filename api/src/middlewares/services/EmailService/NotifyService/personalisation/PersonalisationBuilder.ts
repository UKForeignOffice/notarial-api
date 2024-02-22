import { buildUserConfirmationPersonalisation } from "./personalisationBuilder.userConfirmation";
import { buildPostNotificationPersonalisation } from "./personalisationBuilder.postNotification";

export const PersonalisationBuilder = {
  /**
   * Email to send to a post, mentioning that there is a new form to process.
   */
  postNotification: buildPostNotificationPersonalisation,

  /**
   * Confirmation email for the user, detailing how to book, what to bring etc.
   */
  userConfirmation: buildUserConfirmationPersonalisation,
} as const;
