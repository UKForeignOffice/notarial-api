import { FormType } from "../../../types/FormDataBody";

type ExpressCaseServices = Pick<
  Express.Application["services"],
  "marriageCaseService" | "certifyCopyCaseService" | "requestDocumentCaseService" | "consularLetterCaseService"
>;

export function getCaseServiceName(formType: FormType): keyof ExpressCaseServices {
  const services: Record<FormType, keyof ExpressCaseServices> = {
    affirmation: "marriageCaseService",
    requestDocument: "requestDocumentCaseService",
    consularLetter: "consularLetterCaseService",
    cni: "marriageCaseService",
    exchange: "marriageCaseService",
    certifyCopy: "certifyCopyCaseService",
  };
  return services[formType];
}
