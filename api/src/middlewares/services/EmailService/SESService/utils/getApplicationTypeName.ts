import { FormType } from "../../../../../types/FormDataBody";

const applicationTypeNames: Record<FormType, string> = {
  affirmation: "marital status affirmation",
  cni: "notice of marriage and marital status affirmation",
  exchange: "to exchange a UK issued Certificate of No Impediment for a local notice of marriage",
};

export function getApplicationTypeName(type: FormType) {
  return applicationTypeNames[type];
}
