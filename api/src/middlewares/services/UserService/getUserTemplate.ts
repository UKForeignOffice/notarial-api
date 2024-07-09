import * as additionalContexts from "../utils/additionalContexts.json";
import { FormType } from "../../../types/FormDataBody";

export function getUserTemplate(country: string, type: FormType, postal?: boolean) {
  const postalSupport = postal ?? (type === "exchange" && additionalContexts.countries[country]?.postal && additionalContexts.countries[country]?.cniDelivery);
  if (!postalSupport) {
    return "userConfirmation";
  }
  return "userPostalConfirmation";
}
