import * as additionalContexts from "../utils/additionalContexts.json";

export function getUserTemplate(country: string) {
  const postalSupport = additionalContexts.countries[country]?.postal;
  if (!postalSupport || postalSupport === "false") {
    return "userConfirmation";
  }
  return "userPostalConfirmation";
}
