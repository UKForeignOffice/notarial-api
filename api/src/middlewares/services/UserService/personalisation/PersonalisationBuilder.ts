import { buildUserConfirmationPersonalisation } from "./personalisationBuilder.userConfirmation";
import { buildPostNotificationPersonalisation } from "./personalisationBuilder.postNotification";
import { buildUserPostalConfirmationPersonalisation } from "./personalisationBuilder.userPostalConfirmation";

export const PersonalisationBuilder = {
  /**
   * Email to send to a post, mentioning that there is a new form to process.
   */
  postNotification: buildPostNotificationPersonalisation,

  /**
   * Confirmation email for the user, if the user is applying in person, detailing how to book, what to bring etc.
   */
  userConfirmation: buildUserConfirmationPersonalisation,

  /**
   * Confirmation email for the user, if the user is applying by post, detailing how to book, what to bring etc.
   */
  userPostalConfirmation: buildUserPostalConfirmationPersonalisation,
} as const;
