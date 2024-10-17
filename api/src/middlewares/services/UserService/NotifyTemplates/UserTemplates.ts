import config from "config";
import { AnswersHashMap } from "../../../../types/AnswersHashMap";
import { FormType, MarriageFormType, PayMetadata } from "../../../../types/FormDataBody";
import { MARRIAGE_FORM_TYPES } from "../../../../utils/formTypes";
import { MarriageUserTemplates } from "./MarriageUserTemplates";
import { CertifyCopyUserTemplates } from "./CertifyCopyUserTemplates";
import { RequestDocumentUserTemplates } from "./RequestDocumentUserTemplates";
import { ApplicationError } from "../../../../ApplicationError";

export class UserTemplates {
  marriage: MarriageUserTemplates;
  certifyCopy: CertifyCopyUserTemplates;
  requestDocument: RequestDocumentUserTemplates;

  constructor() {
    try {
      this.marriage = new MarriageUserTemplates();
      this.certifyCopy = new CertifyCopyUserTemplates();
      this.requestDocument = new RequestDocumentUserTemplates();
    } catch (e) {
      console.error("Notify templates have not been configured, exiting", e);
      process.exit(1);
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

    throw new ApplicationError("NOTIFY", "UNKNOWN", 500, `Could not find the right template or builder for ${type}`);
  }

  isMarriageFormType(type: FormType): type is MarriageFormType {
    return MARRIAGE_FORM_TYPES.has(type);
  }
}
