import { FormField } from "../../../../types/FormField";
import { CertifyCopyFormMetadata, FormMetadata, MarriageFormMetadata } from "./FormMetadata";

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

export type ProcessQueueData = CertifyCopyProcessQueueData | MarriageProcessQueueData;
