import { FormType } from "../../../../../types/FormDataBody";

const applicationTypeNames: Record<FormType, string> = {
  affirmation: "marital status affirmation",
  cni: "notice of marriage and marital status affirmation",
};

export function getApplicationTypeName(type: FormType) {
  return applicationTypeNames[type];
}
