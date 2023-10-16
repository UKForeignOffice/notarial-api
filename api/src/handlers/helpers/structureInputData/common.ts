import { InputFields } from "../getAllInputsFromForm";

export interface CommonStructuredDataInput {
  reference: string;
  personalDetails: InputFields;
  maritalStatus: InputFields;
  consent: InputFields;
  declaration: InputFields;
  paymentDetails: InputFields;
}

export enum YesNoMap {
  false = "No",
  true = "Yes",
}
export function getCommonStructuredDataInput(
  formData: InputFields
): CommonStructuredDataInput {
  const {
    firstName,
    middleName,
    surname,
    maritalStatus,
    consent,
    declaration,
    paymentRef,
    reference,
  } = formData;

  return {
    reference: reference as string,
    personalDetails: {
      "First name": firstName,
      "Middle name(s)": middleName ?? "not supplied",
      Surname: surname,
    },
    maritalStatus: {
      "Marital status": maritalStatus ?? "not supplied",
    },
    consent: {
      "Applicant consents to feedback": YesNoMap[consent.toString() ?? "false"],
    },
    declaration: {
      "Applicant declares that all details are correct":
        YesNoMap[declaration.toString() ?? "false"],
    },
    paymentDetails: {
      "Payment reference": paymentRef,
    },
  };
}
