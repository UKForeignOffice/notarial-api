import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";
import { FormType, PayMetadata } from "../../../../../../types/FormDataBody";
import * as additionalContexts from "../../../../utils/additionalContexts.json";
import { getPostForCertifyCopy } from "../../../../utils/getPost";

export function buildPostalPersonalisation(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type: FormType }) {
  const country = answers["country"] as string;
  const post = answers["post"] as string;

  const additionalContext = {
    ...(additionalContexts.certifyCopy.countries[country] ?? {}),
    ...(additionalContexts.certifyCopy.posts[post] ?? {}),
  };

  return {
    firstName: answers.firstName,
    post: getPostForCertifyCopy(country, post),
    reference: metadata.reference,
    postAddress: additionalContext.postAddress,
  };
}
