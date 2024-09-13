import { buildInPersonPersonalisation } from "./inPerson";
import { buildPostalPersonalisation } from "./postal";

export const MarriagePersonalisationBuilder = {
  /**
   * Confirmation email for the user, if the user is applying in person, detailing how to book, what to bring etc.
   */
  inPerson: buildInPersonPersonalisation,

  /**
   * Confirmation email for the user, if the user is applying by post, detailing how to book, what to bring etc.
   */
  postal: buildPostalPersonalisation,
} as const;
