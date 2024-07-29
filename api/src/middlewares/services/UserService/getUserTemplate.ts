import * as additionalContexts from "../utils/additionalContexts.json";
import { FormType } from "../../../types/FormDataBody";

export function getUserTemplate(country: string, type: FormType, postal?: boolean) {
  // for exchange forms, any country that offers a postal journey and cni delivery should be a postal application.
  const countryOffersPostalRoute = additionalContexts.countries[country]?.postal && additionalContexts.countries[country]?.cniDelivery;

  // Croatia is an exception to this, and only offers in-person applications for exchange
  const countryIsCroatia = country === "Croatia";

  const postalSupport = postal ?? (type === "exchange" && countryOffersPostalRoute && !countryIsCroatia);

  if (!postalSupport) {
    return "userConfirmation";
  }
  return "userPostalConfirmation";
}
