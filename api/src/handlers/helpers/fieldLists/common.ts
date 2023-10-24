export enum YesNoMap {
  false = "No",
  true = "Yes",
}

export type CommonFieldList =
  | "firstName"
  | "middleName"
  | "surname"
  | "maritalStatus"
  | "consent"
  | "declaration";

export const commonFieldList: Set<CommonFieldList> = new Set([
  "firstName",
  "middleName",
  "surname",
  "maritalStatus",
  "consent",
  "declaration",
]);
