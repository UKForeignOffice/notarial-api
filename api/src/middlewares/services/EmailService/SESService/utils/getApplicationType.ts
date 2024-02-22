import { FormType } from "../../../../../types/FormDataBody";

const applicationTypes = {
  affirmation: "marital status affirmation",
  cni: "notice of marriage and marital status affirmation",
};

export function getApplicationType(type: FormType) {
  return applicationTypes[type];
}
