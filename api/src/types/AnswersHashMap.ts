import { MarriageTemplateType } from "../middlewares/services/utils/types";

export type MarriageAnswersHashMap = {
  service?: MarriageTemplateType;
  isCivilPartnership?: boolean;
  [key: string]: string | boolean | undefined;
};

export type CertifyCopyAnswersHashmap = {
  over16?: boolean;
} & Record<string, string | boolean>;

export type RequestDocumentAnswersHashmap = {
  serviceType: string;
  applicationCountry?: string;
  post?: string;
} & Record<string, string | boolean>;

export type ConsularLetterAnswersHashmap = {
  letterChoice: string;
  hasDeceasedsPassport: boolean;
} & Record<string, string | boolean>;

export type AnswersHashMap = MarriageAnswersHashMap | CertifyCopyAnswersHashmap | RequestDocumentAnswersHashmap | ConsularLetterAnswersHashmap;
