import { buildUserConfirmationPersonalisation } from "./personalisationBuilder.userConfirmation";
import { buildUserPostalConfirmationPersonalisation } from "./personalisationBuilder.userPostalConfirmation";

export const CertifyCopyPersonalisationBuilder = {
  userConfirmation: buildUserConfirmationPersonalisation,
  userPostalConfirmation: buildUserPostalConfirmationPersonalisation,
};
