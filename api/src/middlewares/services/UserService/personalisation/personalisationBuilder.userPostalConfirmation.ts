import * as additionalContexts from "./../../utils/additionalContexts.json";
import { getPost } from "../../utils/getPost";
import { AnswersHashMap } from "../../../../types/AnswersHashMap";
import { PayMetadata } from "../../../../types/FormDataBody";

export function getUserPostalConfirmationAdditionalContext(country: string, post?: string) {
  const postName = getPost(country, post);
  const additionalCountryContext = additionalContexts.countries[country];
  const additionalPostContext = additionalContexts.posts[postName];

  return {
    ...additionalCountryContext,
    ...additionalPostContext,
  };
}
export function buildUserPostalConfirmationPersonalisation(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata }) {
  const isSuccessfulPayment = metadata.payment?.state?.status === "success" ?? false;
  const country = answers["country"] as string;
  const post = answers["post"] as string;
  const previousMarriage = answers.maritalStatus && answers.maritalStatus !== "Never married";

  // Italy and Spain are the only countries that requires the partner's proof of end of marriage doc
  const partnerHasPreviousMarriage = answers.partnerMaritalStatus && answers.partnerMaritalStatus !== "Never married";
  const italySpainPartnerPreviousMarriage = (country === "Italy" || country === "Spain") && partnerHasPreviousMarriage;

  // For Croatia, there is an additional question asking if the user needs a certificate of custom law. If the answer is yes, they will need to provide this with their postal application
  const croatiaCertNeeded = answers.certRequired === true;

  const additionalContext = getUserPostalConfirmationAdditionalContext(country, post);

  return {
    firstName: answers.firstName,
    post: additionalContext.post,
    country,
    bookingLink: additionalContext.bookingLink,
    localRequirements: additionalContext.localRequirements,
    civilPartnership: additionalContext.civilPartnership,
    previousMarriage,
    italySpainPartnerPreviousMarriage,
    croatiaCertNeeded,
    reference: metadata.reference,
    postAddress: additionalContext.postAddress,
    notPaid: !isSuccessfulPayment,
  };
}
