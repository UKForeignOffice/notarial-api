import {
  CommonStructuredDataInput,
  getCommonStructuredDataInput,
  YesNoMap,
} from "./common";
import { InputFields } from "../getAllInputsFromForm";

export interface CNIStructuredDataInput extends CommonStructuredDataInput {
  cniDetails: InputFields;
}

export function getCNIStructuredDataInput(
  formData: InputFields
): CNIStructuredDataInput {
  const {
    country,
    hasUkPassport,
    ceremonyType,
    partnerIsOppositeSex,
    partnerIsLocal,
    partnersAreOfAge,
    oathType,
    paymentMethod,
  } = formData;

  const nationalLabel = `Partner is a ${country} national`;

  return {
    cniDetails: {
      "Has a UK passport": YesNoMap[hasUkPassport.toString()],
      "Ceremony type": ceremonyType,
      "Partner is of the opposite sex":
        YesNoMap[partnerIsOppositeSex.toString()],
      [nationalLabel]: YesNoMap[partnerIsLocal.toString()],
      "Partners meet the minimum age requirements":
        YesNoMap[partnersAreOfAge.toString()],
      "Religious or non religious oath": oathType,
      "Payment method": paymentMethod,
    },
    ...getCommonStructuredDataInput(formData),
  };
}
