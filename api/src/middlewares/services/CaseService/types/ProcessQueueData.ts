import { FormField } from "../../../../types/FormField";
import { CertifyCopyFormMetadata, ConsularLetterFormMetadata, FormMetadata, MarriageFormMetadata, RequestDocumentFormMetadata } from "./FormMetadata";

interface ProcessQueueDataBase {
  fields: FormField[];
  metadata: FormMetadata;
}

export interface CertifyCopyProcessQueueData extends ProcessQueueDataBase {
  metadata: CertifyCopyFormMetadata;
}

export interface MarriageProcessQueueData extends ProcessQueueDataBase {
  metadata: MarriageFormMetadata;
}

export interface RequestDocumentProcessQueueData extends ProcessQueueDataBase {
  metadata: RequestDocumentFormMetadata;
}

export interface ConsularLetterProcessQueueData extends ProcessQueueDataBase {
  metadata: ConsularLetterFormMetadata;
}

export type ProcessQueueData = CertifyCopyProcessQueueData | MarriageProcessQueueData | ConsularLetterProcessQueueData;
