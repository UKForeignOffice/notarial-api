import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";
import { FormType, PayMetadata } from "../../../../../../types/FormDataBody";
import * as additionalContexts from "../../../../utils/additionalContexts.json";

export function buildPostalPersonalisation(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type: FormType }) {
  const isSuccessfulPayment = metadata.payment?.state?.status === "success" ?? false;
  const country = answers["country"] as string;

  const additionalContext = {
    ...(additionalContexts.certifyCopy.countries[country] ?? {}),
  };

  return {
    firstName: answers.firstName,
    post: additionalContext.post,
    reference: metadata.reference,
    postAddress: additionalContext.postAddress,
    notPaid: !isSuccessfulPayment,
  };
}
