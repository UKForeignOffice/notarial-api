import { MarriageTemplateType } from "../../utils/types";

const applicationTypeNames: Record<MarriageTemplateType, string> = {
  affirmation: "a marital status affirmation",
  cni: "a notice of marriage and marital status affirmation",
  exchange: "to exchange a UK issued Certificate of No Impediment for a local notice of marriage",
  msc: "a marital status certificate",
  cniAndMsc: "a notice of marriage and marital status certificate",
};

export function getApplicationTypeName(type: MarriageTemplateType) {
  return applicationTypeNames[type];
}
