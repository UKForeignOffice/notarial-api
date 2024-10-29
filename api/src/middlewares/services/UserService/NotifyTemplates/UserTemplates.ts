import { AnswersHashMap } from "../../../../types/AnswersHashMap";
import { FormType, MarriageFormType, PayMetadata } from "../../../../types/FormDataBody";
import { MARRIAGE_FORM_TYPES } from "../../../../utils/formTypes";
import { MarriageUserTemplates } from "./MarriageUserTemplates";
import { CertifyCopyUserTemplates } from "./CertifyCopyUserTemplates";
import { RequestDocumentUserTemplates } from "./RequestDocumentUserTemplates";
import { ApplicationError } from "../../../../ApplicationError";
import { ConsularLetterUserTemplates } from "./ConsularLetterUserTemplates";

export class UserTemplates {
  marriage: MarriageUserTemplates;
  certifyCopy: CertifyCopyUserTemplates;
  requestDocument: RequestDocumentUserTemplates;
  consularLetter: ConsularLetterUserTemplates;

  constructor() {
    try {
      this.marriage = new MarriageUserTemplates();
      this.certifyCopy = new CertifyCopyUserTemplates();
      this.requestDocument = new RequestDocumentUserTemplates();
      this.consularLetter = new ConsularLetterUserTemplates();
    } catch (e) {
      console.error("Notify templates have not been configured, exiting", e);
      throw e;
    }
  }

  getTemplate(data: { answers: AnswersHashMap; metadata: { reference: string; payment?: PayMetadata; type: FormType; postal?: boolean } }) {
    const { type } = data.metadata;

    if (this.isMarriageFormType(type)) {
      return this.marriage.getTemplate(data);
    }

    if (type === "certifyCopy") {
      return this.certifyCopy.getTemplate(data);
    }

    if (type === "requestDocument") {
      return this.requestDocument.getTemplate(data);
    }

    if (type === "consularLetter") {
      return this.consularLetter.getTemplate(data);
    }

    throw new ApplicationError("NOTIFY", "UNKNOWN", 500, `Could not find the right template or builder for ${type}`);
  }

  isMarriageFormType(type: FormType): type is MarriageFormType {
    return MARRIAGE_FORM_TYPES.has(type);
  }
}
