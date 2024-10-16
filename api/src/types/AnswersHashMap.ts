import { MarriageTemplateType } from "../middlewares/services/utils/types";

export type MarriageAnswersHashMap = {
  service?: MarriageTemplateType;
  [key: string]: string | boolean | undefined;
};

export type CertifyCopyAnswersHashmap = {
  over16?: boolean;
} & Record<string, string | boolean>;

export type RequestDocumentAnswersHashmap = {
  serviceType: string;
  country?: string;
  post?: string;
} & Record<string, string | boolean>;

export type AnswersHashMap = MarriageAnswersHashMap | CertifyCopyAnswersHashmap | RequestDocumentAnswersHashmap;
