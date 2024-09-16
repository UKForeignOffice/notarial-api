import { FormType } from "../../../types/FormDataBody";
import { MARRIAGE_FORM_TYPES } from "../../../utils/formTypes";

type ExpressCaseServices = Pick<Express.Application["services"], "marriageCaseService" | "certifyCopyCaseService">;

export function getCaseServiceName(formType: FormType): keyof ExpressCaseServices {
  if (MARRIAGE_FORM_TYPES.has(formType)) {
    return "marriageCaseService";
  }
  return "certifyCopyCaseService";
}
