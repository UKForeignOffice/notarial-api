import { CommonFieldList, commonFieldList } from "./common";

export type CNIFieldList =
  | CommonFieldList
  | "country"
  | "hasUkPassport"
  | "ceremonyType"
  | "partnerIsOppositeSex"
  | "partnerIsLocal"
  | "partnersAreOfAge"
  | "oathType"
  | "paymentMethod";
export const cniFieldList: Set<CNIFieldList> = new Set([
  ...commonFieldList,
  "country",
  "hasUkPassport",
  "ceremonyType",
  "partnerIsOppositeSex",
  "partnerIsLocal",
  "partnersAreOfAge",
  "oathType",
  "paymentMethod",
]);
