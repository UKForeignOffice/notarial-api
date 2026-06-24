import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";
import { FormType, PayMetadata } from "../../../../../../types/FormDataBody";
import { ApplicationError } from "../../../../../../ApplicationError";
import * as additionalContexts from "../../../../utils/additionalContexts.json";
import { getPostForCertifyCopy } from "../../../../utils/getPost";

export function buildInPersonPersonalisation(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type?: FormType }) {
  if (!answers) {
    throw new ApplicationError("WEBHOOK", "VALIDATION", 500, "Fields are empty");
  }

  const country = answers["country"] as string;
  const post = answers["post"] as string;

  const additionalContext = {
    ...(additionalContexts.certifyCopy.countries[country] ?? {}),
    ...(additionalContexts.certifyCopy.posts[post] ?? {}),
  };

  return {
    firstName: answers.firstName,
    post: getPostForCertifyCopy(country, post),
    bookingLink: additionalContext.bookingLink,
    reference: metadata.reference,
  };
}
