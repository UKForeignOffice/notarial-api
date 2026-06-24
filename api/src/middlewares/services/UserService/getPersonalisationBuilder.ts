import { MarriagePersonalisationBuilder } from "./personalisation/PersonalisationBuilder/marriage/PersonalisationBuilder";
import { CertifyCopyPersonalisationBuilder } from "./personalisation/PersonalisationBuilder/certifyCopy/PersonalisationBuilder";
import { FormType } from "../../../types/FormDataBody";
import { MARRIAGE_FORM_TYPES } from "../../../utils/formTypes";
import { RequestDocumentPersonalisationBuilder } from "./personalisation/PersonalisationBuilder/requestDocument";
import { ConsularLetterPersonalisationBuilder } from "./personalisation/PersonalisationBuilder/consularLetter";

const personalisationBuilderMapper = {
  marriage: MarriagePersonalisationBuilder,
  certifyCopy: CertifyCopyPersonalisationBuilder,
  requestDocument: RequestDocumentPersonalisationBuilder,
  consularLetter: ConsularLetterPersonalisationBuilder,
};
export function getPersonalisationBuilder(type: FormType) {
  if (MARRIAGE_FORM_TYPES.has(type)) {
    return personalisationBuilderMapper.marriage;
  }
  return personalisationBuilderMapper[type];
}
