import * as additionalContexts from "../../../../utils/additionalContexts.json";
import { getPost } from "../../../../utils/getPost";
import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";
import { PayMetadata } from "../../../../../../types/FormDataBody";

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
  /**
   * TODO: - Some of these personalisations are not used in email templates. They need to be removed.
   */
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
    additionalDocs: additionalContext.additionalDocs,
    countryIsItalyAndPartnerHadPreviousMarriage: country === "Italy" && partnerHadPreviousMarriage,
    countryIsItalyAndDoesNotLiveInItaly: country === "Italy" && livesOutsideApplicationCountry,
    countryIsCroatia: country === "Croatia",
  };
}
