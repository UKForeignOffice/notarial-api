import * as additionalContexts from "../additionalContexts.json";

export function getUserTemplate(country: string) {
  const postalSupport = additionalContexts.countries[country]?.postal;
  if (!postalSupport || postalSupport === "false") {
    return "userConfirmation";
  }
  return "userPostalConfirmation";
}
