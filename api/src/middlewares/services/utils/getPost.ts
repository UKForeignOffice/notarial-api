import * as additionalContexts from "./additionalContexts.json";
import { FormType } from "../../../types/FormDataBody";
import { MARRIAGE_FORM_TYPES } from "../../../utils/formTypes";

export function getPost(country: string, type: FormType, post?: string) {
  let additionalContext: Record<string, any> = { ...additionalContexts };
  if (!MARRIAGE_FORM_TYPES.has(type)) {
    additionalContext = additionalContext.certifyCopy;
  }
  return post ?? additionalContext.countries?.[country]?.post;
}
