import { CertifyCopyFormType, FormType, MarriageFormType, PayMetadata } from "../../../../types/FormDataBody";

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
