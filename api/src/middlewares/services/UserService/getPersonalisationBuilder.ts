import { MarriagePersonalisationBuilder } from "./personalisation/personalisationBuilder/marriage/PersonalisationBuilder";
import { CertifyCopyPersonalisationBuilder } from "./personalisation/personalisationBuilder/certifyCopy/PersonalisationBuilder";
import { FormType } from "../../../types/FormDataBody";
import { MARRIAGE_CASE_TYPES } from "../../../utils/formTypes";

const personalisationBuilderMapper = {
  marriage: MarriagePersonalisationBuilder,
  certifyCopy: CertifyCopyPersonalisationBuilder,
};
export function getPersonalisationBuilder(type: FormType) {
  if (MARRIAGE_CASE_TYPES.has(type)) {
    return personalisationBuilderMapper.marriage;
  }
  return personalisationBuilderMapper[type];
}
