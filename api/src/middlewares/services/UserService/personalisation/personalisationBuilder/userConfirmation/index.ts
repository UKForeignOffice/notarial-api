import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";
import { FormType, PayMetadata } from "../../../../../../types/FormDataBody";
import { ApplicationError } from "../../../../../../ApplicationError";
import * as additionalContexts from "../../../../utils/additionalContexts.json";
import { getPost } from "../../../../utils/getPost";
import { personalisationTypeMap } from "./getAdditionalPersonalisations";

export function buildUserConfirmationPersonalisation(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type?: FormType }) {
  const isSuccessfulPayment = metadata.payment?.state?.status === "success" ?? false;

  if (!answers) {
    throw new ApplicationError("WEBHOOK", "VALIDATION", 500, "Fields are empty");
  }

  const getAdditionalPersonalisations = personalisationTypeMap[metadata.type!];
  if (!getAdditionalPersonalisations) {
    throw new ApplicationError("WEBHOOK", "VALIDATION", 500, `No personalisation mapper set for form type: ${metadata.type}`);
  }
  const additionalPersonalisations = getAdditionalPersonalisations(answers);

  const country = answers["country"] as string;
  const post = answers["post"] as string;

  const additionalContext = {
    ...(additionalContexts.countries[country] ?? {}),
    ...(additionalContexts.posts[post] ?? additionalContexts.countries[country].post ?? {}),
  };

  return {
    firstName: answers.firstName,
    post: getPost(country, post),
    country,
    bookingLink: additionalContext.bookingLink,
    localRequirements: additionalContext.localRequirements,
    civilPartnership: additionalContext.civilPartnership,
    reference: metadata.reference,
    confirmationDelay: additionalContext.confirmationDelay ?? "2 weeks",
    notPaid: !isSuccessfulPayment,
    ...additionalPersonalisations,
    additionalDocs: additionalContext.additionalDocs ?? "",
  };
}
