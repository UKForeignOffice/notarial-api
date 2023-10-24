import { CommonFieldList, commonFieldList } from "./common";

export type AffirmationFieldList =
  | CommonFieldList
  | "hasUkPassport"
  | "ceremonyType"
  | "partnerIsOppositeSex"
  | "partnerIsLocal"
  | "partnersAreOfAge"
  | "oathType"
  | "paymentMethod";
export const affirmationFieldList: Set<AffirmationFieldList> = new Set([
  ...commonFieldList,
  "hasUkPassport",
  "ceremonyType",
  "partnerIsOppositeSex",
  "partnerIsLocal",
  "partnersAreOfAge",
  "oathType",
  "paymentMethod",
]);
