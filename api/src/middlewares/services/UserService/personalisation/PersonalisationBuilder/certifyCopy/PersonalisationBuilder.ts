import { buildUserPostalConfirmationPersonalisation } from "./personalisationBuilder.userPostalConfirmation";
import { buildUserConfirmationPersonalisation } from "./personalisationBuilder.userConfirmation";

export const CertifyCopyPersonalisationBuilder = {
  userConfirmation: buildUserConfirmationPersonalisation,
  userPostalConfirmation: buildUserPostalConfirmationPersonalisation,
};
