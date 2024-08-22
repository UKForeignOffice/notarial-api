import * as additionalContexts from "../../../../utils/additionalContexts.json";
import { getPost } from "../../../../utils/getPost";
import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";
import { PayMetadata } from "../../../../../../types/FormDataBody";
import { getAdditionalDocsForCountry } from "./getAdditionalDocsForCountry";

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
  const userHadPreviousMarriage = answers.maritalStatus !== "Never married";
  const livesInCountry = answers.livesInCountry === true;
  const livesOutsideApplicationCountry = answers.livesInCountry === false;
  const partnerHadPreviousMarriage = answers.partnerMaritalStatus !== "Never married";

  const additionalContext = getUserPostalConfirmationAdditionalContext(country, post);
  const getAdditionalDocs = getAdditionalDocsForCountry[country];
  const additionalDocs = getAdditionalDocs?.(answers, additionalContext) ?? additionalContext.additionalDocs;

  return {
    firstName: answers.firstName,
    post: additionalContext.post,
    country,
    bookingLink: additionalContext.bookingLink,
    localRequirements: additionalContext.localRequirements,
    civilPartnership: additionalContext.civilPartnership,
    userHadPreviousMarriage,
    livesInCountry,
    livesOutsideApplicationCountry,
    partnerHadPreviousMarriage,
    reference: metadata.reference,
    postAddress: additionalContext.postAddress,
    notPaid: !isSuccessfulPayment,
    additionalDocs,
  };
}
