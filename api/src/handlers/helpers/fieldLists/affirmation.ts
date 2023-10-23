import { commonFieldList } from "./common";

export const affirmationFieldList = new Set([
  ...commonFieldList,
  "hasUkPassport",
  "ceremonyType",
  "partnerIsOppositeSex",
  "partnerIsLocal",
  "partnersAreOfAge",
  "oathType",
  "paymentMethod",
]);
