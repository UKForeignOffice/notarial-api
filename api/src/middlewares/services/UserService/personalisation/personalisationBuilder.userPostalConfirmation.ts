import * as additionalContexts from "./../../utils/additionalContexts.json";
import { getPost } from "../../utils/getPost";
import { AnswersHashMap } from "../../../../types/AnswersHashMap";
import { PayMetadata } from "../../../../types/FormDataBody";

export function buildUserPostalConfirmationPersonalisation(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata }) {
  const isSuccessfulPayment = metadata.payment?.state?.status === "success" ?? false;
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
    postAddress: additionalContext.postAddress,
    notPaid: !isSuccessfulPayment,
  };
}
