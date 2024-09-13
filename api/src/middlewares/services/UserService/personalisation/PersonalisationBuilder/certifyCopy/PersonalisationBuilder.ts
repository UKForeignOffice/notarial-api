import { buildPostalPersonalisation } from "./personalisationBuilder.postal";
import { buildInPersonPersonalisation } from "./personalisationBuilder.inPerson";

export const CertifyCopyPersonalisationBuilder = {
  inPerson: buildInPersonPersonalisation,
  postal: buildPostalPersonalisation,
};
