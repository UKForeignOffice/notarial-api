import { FormType } from "../../../types/FormDataBody";

type ExpressCaseServices = Pick<Express.Application["services"], "marriageCaseService" | "certifyCopyCaseService" | "requestDocumentCaseService">;

export function getCaseServiceName(formType: FormType): keyof ExpressCaseServices {
  const services: Record<FormType, keyof ExpressCaseServices> = {
    affirmation: "marriageCaseService",
    requestDocument: "requestDocumentCaseService",
    cni: "marriageCaseService",
    exchange: "marriageCaseService",
    certifyCopy: "certifyCopyCaseService",
  };
  return services[formType];
}
