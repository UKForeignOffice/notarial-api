import { commonFieldList } from "./common";

export const cniFieldList = new Set([
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
