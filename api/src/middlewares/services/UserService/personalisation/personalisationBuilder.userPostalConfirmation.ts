import * as additionalContexts from "./../../utils/additionalContexts.json";
import { getPost } from "../../utils/getPost";
import { AnswersHashMap } from "../../../../types/AnswersHashMap";
import { FormType, PayMetadata } from "../../../../types/FormDataBody";

export function getUserPostalConfirmationAdditionalContext(country: string, post?: string) {
  const postName = getPost(country, post);
  const additionalCountryContext = additionalContexts.countries[country];
  const additionalPostContext = additionalContexts.posts[postName];

  return {
    ...additionalCountryContext,
    ...additionalPostContext,
  };
}
export function buildUserPostalConfirmationPersonalisation(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata }, _type: FormType) {
  const isSuccessfulPayment = metadata.payment?.state?.status === "success" ?? false;
  const country = answers["country"] as string;
  const post = answers["post"] as string;
  const previousMarriage = answers.maritalStatus && answers.maritalStatus !== "Never married";

  const additionalContext = getUserPostalConfirmationAdditionalContext(country, post);

  return {
    firstName: answers.firstName,
    post: additionalContext.post,
    country,
    bookingLink: additionalContext.bookingLink,
    localRequirements: additionalContext.localRequirements,
    civilPartnership: additionalContext.civilPartnership,
    previousMarriage,
    reference: metadata.reference,
    postAddress: additionalContext.postAddress,
    notPaid: !isSuccessfulPayment,
  };
}
