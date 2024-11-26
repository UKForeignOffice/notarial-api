import { AnswersHashMap } from "../../../../../../../types/AnswersHashMap";
import { FormType, PayMetadata } from "../../../../../../../types/FormDataBody";
import { ApplicationError } from "../../../../../../../ApplicationError";
import * as additionalContexts from "../../../../../utils/additionalContexts.json";
import { getPostForMarriage } from "../../../../../utils/getPost";
import { personalisationTypeMap } from "./getAdditionalPersonalisations";
import { getAdditionalDocsForCountry } from "./getAdditionalDocsForCountry";

export function buildInPersonPersonalisation(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type?: FormType }) {
  const isSuccessfulPayment = metadata.payment?.state?.status === "success";

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
    ...(additionalContexts.marriage.countries[country] ?? {}),
    ...(additionalContexts.marriage.posts[post] ?? additionalContexts.marriage.countries[country].post ?? {}),
  };

  const getAdditionalDocs = getAdditionalDocsForCountry[country];

  const additionalDocs = getAdditionalDocs?.(answers, additionalContext, metadata) ?? additionalContext.additionalDocs;

  return {
    firstName: answers.firstName,
    post: getPostForMarriage(country, post),
    country,
    bookingLink: additionalContext.bookingLink,
    localRequirements: additionalContext.localRequirements ?? "",
    civilPartnership: additionalContext.civilPartnership,
    reference: metadata.reference,
    notPaid: !isSuccessfulPayment,
    ...additionalPersonalisations,
    additionalDocs: additionalDocs ?? "",
  };
}
