import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";
import { FormType, PayMetadata } from "../../../../../../types/FormDataBody";
import { ApplicationError } from "../../../../../../ApplicationError";
import * as additionalContexts from "../../../../utils/additionalContexts.json";

export function buildUserConfirmationPersonalisation(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type?: FormType }) {
  const isSuccessfulPayment = metadata.payment?.state?.status === "success" ?? false;

  if (!answers) {
    throw new ApplicationError("WEBHOOK", "VALIDATION", 500, "Fields are empty");
  }

  const country = answers["country"] as string;

  const additionalContext = {
    ...(additionalContexts.certifyCopy.countries[country] ?? {}),
  };

  return {
    firstName: answers.firstName,
    post: additionalContext.post,
    bookingLink: additionalContext.bookingLink,
    reference: metadata.reference,
    notPaid: !isSuccessfulPayment,
  };
}
