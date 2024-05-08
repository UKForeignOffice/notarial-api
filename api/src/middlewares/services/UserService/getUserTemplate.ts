import * as additionalContexts from "../utils/additionalContexts.json";

export function getUserTemplate(country: string, postal?: boolean) {
  const postalSupport = postal ?? additionalContexts.countries[country]?.postal;
  if (!postalSupport) {
    return "userConfirmation";
  }
  return "userPostalConfirmation";
}
