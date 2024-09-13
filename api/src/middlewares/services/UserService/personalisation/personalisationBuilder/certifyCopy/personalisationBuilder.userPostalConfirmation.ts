import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";
import { FormType, PayMetadata } from "../../../../../../types/FormDataBody";
import * as additionalContexts from "../../../../utils/additionalContexts.json";

export function buildUserPostalConfirmationPersonalisation(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type: FormType }) {
  const isSuccessfulPayment = metadata.payment?.state?.status === "success" ?? false;
  const country = answers["country"] as string;

  return {
    firstName: answers.firstName,
    post: additionalContexts.countries[country].post,
    reference: metadata.reference,
    postAddress: additionalContexts.countries[country].postAddress,
    notPaid: !isSuccessfulPayment,
  };
}
