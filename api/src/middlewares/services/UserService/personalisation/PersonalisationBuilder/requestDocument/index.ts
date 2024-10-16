import { RequestDocumentAnswersHashmap } from "../../../../../../types/AnswersHashMap";
import { PayMetadata, RequestDocumentFormType } from "../../../../../../types/FormDataBody";
import { ApplicationError } from "../../../../../../ApplicationError";
import { getPostForRequestDocument } from "../../../../utils/getPost";

export function requestDocumentPersonalisationBuilder(
  answers: RequestDocumentAnswersHashmap,
  metadata: { reference: string; payment?: PayMetadata; type?: RequestDocumentFormType }
) {
  if (!answers) {
    throw new ApplicationError("WEBHOOK", "VALIDATION", 500, "Fields are empty");
  }
  const post = getPostForRequestDocument(answers.serviceType, answers.applicationCountry, answers.post);

  return {
    post,
    serviceName: answers.serviceType,
    reference: metadata.reference,
    firstName: answers.firstName,
  };
}
