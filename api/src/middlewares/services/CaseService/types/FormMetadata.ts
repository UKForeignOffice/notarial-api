import { CertifyCopyFormType, ConsularLetterFormType, FormType, MarriageFormType, PayMetadata, RequestDocumentFormType } from "../../../../types/FormDataBody";

export interface FormMetadata {
  reference: string;
  payment?: PayMetadata;
  type: FormType;
}

export interface MarriageFormMetadata extends FormMetadata {
  type: MarriageFormType;
  postal?: boolean;
}

export interface CertifyCopyFormMetadata extends FormMetadata {
  type: CertifyCopyFormType;
}

export interface RequestDocumentFormMetadata extends FormMetadata {
  type: RequestDocumentFormType;
}

export interface ConsularLetterFormMetadata extends FormMetadata {
  type: ConsularLetterFormType;
}
