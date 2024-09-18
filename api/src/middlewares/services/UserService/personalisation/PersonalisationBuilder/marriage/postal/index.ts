import * as additionalContexts from "../../../../../utils/additionalContexts.json";
import { getPostForMarriage } from "../../../../../utils/getPost";
import { AnswersHashMap } from "../../../../../../../types/AnswersHashMap";
import { MarriageFormType, PayMetadata } from "../../../../../../../types/FormDataBody";
import { personalisationTypeMap } from "./getAdditionalPersonalisations";
import { ApplicationError } from "../../../../../../../ApplicationError";

export function getPostalAdditionalContext(country: string, post?: string) {
  const postName = getPostForMarriage(country, post);
  const additionalCountryContext = additionalContexts.marriage.countries[country];
  const additionalPostContext = additionalContexts.marriage.posts[postName];

  return {
    ...additionalCountryContext,
    ...additionalPostContext,
  };
}

export function buildPostalPersonalisation(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type: MarriageFormType }) {
  const isSuccessfulPayment = metadata.payment?.state?.status === "success" ?? false;
  const country = answers["country"] as string;
  const post = answers["post"] as string;
  const userHadPreviousMarriage = answers.maritalStatus !== "Never married";

  const additionalContext = getPostalAdditionalContext(country, post);
  const getAdditionalPersonalisations = personalisationTypeMap[metadata.type!];
  if (!getAdditionalPersonalisations) {
    throw new ApplicationError("WEBHOOK", "VALIDATION", 500, `No personalisation mapper set for form type: ${metadata.type}`);
  }
  const additionalPersonalisations = getAdditionalPersonalisations(answers);
  return {
    firstName: answers.firstName,
    post: additionalContext.post,
    country,
    localRequirements: additionalContext.localRequirements,
    civilPartnership: additionalContext.civilPartnership,
    userHadPreviousMarriage,
    ...additionalPersonalisations,
    reference: metadata.reference,
    postAddress: additionalContext.postAddress,
    notPaid: !isSuccessfulPayment,
  };
}
