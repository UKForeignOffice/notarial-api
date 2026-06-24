import { AnswersHashMap, RequestDocumentAnswersHashmap } from "../../../../../../types/AnswersHashMap";
import { FormType, PayMetadata } from "../../../../../../types/FormDataBody";
import { ApplicationError } from "../../../../../../ApplicationError";
import { getPostForRequestDocument } from "../../../../utils/getPost";
import { getPostAddressForRequestDocument } from "../../../../utils/getPostAddressForRequestDocument";
import { getBookingLinkForRequestDocument } from "../../../../utils/getBookingLinkForRequestDocument";

export function RequestDocumentPersonalisationBuilder(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type?: FormType }) {
  if (!answers) {
    throw new ApplicationError("WEBHOOK", "VALIDATION", 500, "Fields are empty");
  }

  const requestDocumentAnswers = answers as RequestDocumentAnswersHashmap;
  const { serviceType, applicationCountry, post: answersPost } = requestDocumentAnswers;
  const post = getPostForRequestDocument(serviceType, applicationCountry, answersPost);

  const postAddress = getPostAddressForRequestDocument(serviceType);
  const bookingLink = getBookingLinkForRequestDocument(post, serviceType);

  return {
    post,
    serviceName: answers.serviceType,
    reference: metadata.reference,
    firstName: answers.firstName,
    postAddress,
    bookingLink,
  };
}
