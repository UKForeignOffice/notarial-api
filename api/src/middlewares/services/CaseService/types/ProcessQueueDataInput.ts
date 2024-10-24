import { FormField } from "../../../../types/FormField";
import { CertifyCopyFormType, ConsularLetterFormType, FormDataBody, FormType, MarriageFormType, RequestDocumentFormType } from "../../../../types/FormDataBody";

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

export interface RequestDocumentProcessQueueDataInput extends ProcessQueueDataInput {
  type: RequestDocumentFormType;
}

export interface ConsularLetterProcessQueueDataInput extends ProcessQueueDataInput {
  type: ConsularLetterFormType;
}
