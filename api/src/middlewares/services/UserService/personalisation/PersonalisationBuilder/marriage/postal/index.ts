import * as additionalContexts from "../../../../../utils/additionalContexts.json";
import { getPost } from "../../../../../utils/getPost";
import { AnswersHashMap } from "../../../../../../../types/AnswersHashMap";
import { FormType, PayMetadata } from "../../../../../../../types/FormDataBody";
import { personalisationTypeMap } from "./getAdditionalPersonalisations";
import { ApplicationError } from "../../../../../../../ApplicationError";

export function getPostalAdditionalContext(country: string, type: FormType, post?: string) {
  const postName = getPost(country, type, post);
  const additionalCountryContext = additionalContexts.countries[country];
  const additionalPostContext = additionalContexts.posts[postName];

  return {
    ...additionalCountryContext,
    ...additionalPostContext,
  };
}

export function buildPostalPersonalisation(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type: FormType }) {
  const isSuccessfulPayment = metadata.payment?.state?.status === "success" ?? false;
  const country = answers["country"] as string;
  const post = answers["post"] as string;
  const userHadPreviousMarriage = answers.maritalStatus !== "Never married";

  const additionalContext = getPostalAdditionalContext(country, metadata.type, post);
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
