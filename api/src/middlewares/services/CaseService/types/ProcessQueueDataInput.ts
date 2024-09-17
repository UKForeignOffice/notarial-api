import { FormField } from "../../../../types/FormField";
import { CertifyCopyFormType, FormDataBody, FormType, MarriageFormType } from "../../../../types/FormDataBody";

export interface ProcessQueueDataInput {
  fields: FormField[];
  reference: string;
  type: FormType;
  metadata: FormDataBody["metadata"];
}

export interface MarriageProcessQueueDataInput extends ProcessQueueDataInput {
  type: MarriageFormType;
}

export interface CertifyCopyProcessQueueDataInput extends ProcessQueueDataInput {
  type: CertifyCopyFormType;
}
