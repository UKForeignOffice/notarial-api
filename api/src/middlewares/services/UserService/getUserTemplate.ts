import * as additionalContexts from "../utils/additionalContexts.json";
import { FormType } from "../../../types/FormDataBody";

export function getUserTemplate(country: string, postal?: boolean, type: FormType) {
  const postalSupport = postal ?? (type === "exchange" && additionalContexts.countries[country]?.postal);
  if (!postalSupport) {
    return "userConfirmation";
  }
  return "userPostalConfirmation";
}
