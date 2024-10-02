import { MarriageFormType } from "../../../../types/FormDataBody";

const applicationTypeNames: Record<MarriageFormType, string> = {
  affirmation: "a marital status affirmation",
  cni: "a notice of marriage and marital status affirmation",
  exchange: "to exchange a UK issued Certificate of No Impediment for a local notice of marriage",
  msc: "a marital status certificate",
  cniAndMsc: "a notice of marriage and marital status certificate",
};

export function getApplicationTypeName(type: MarriageFormType) {
  return applicationTypeNames[type];
}
