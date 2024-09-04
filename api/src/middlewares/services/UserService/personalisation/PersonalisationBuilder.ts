import { buildUserConfirmationPersonalisation } from "./personalisationBuilder/userConfirmation";
import { buildUserPostalConfirmationPersonalisation } from "./personalisationBuilder/userPostalConfirmation";

export const PersonalisationBuilder = {
  /**
   * Confirmation email for the user, if the user is applying in person, detailing how to book, what to bring etc.
   */
  userConfirmation: buildUserConfirmationPersonalisation,

  /**
   * Confirmation email for the user, if the user is applying by post, detailing how to book, what to bring etc.
   */
  userPostalConfirmation: buildUserPostalConfirmationPersonalisation,
} as const;
