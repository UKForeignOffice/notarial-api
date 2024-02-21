import { formType } from "../../../../../types/FormDataBody";

const applicationTypes = {
  affirmation: "marital status affirmation",
  cni: "notice of marriage and marital status affirmation",
};

export function getApplicationType(type: formType) {
  return applicationTypes[type];
}
