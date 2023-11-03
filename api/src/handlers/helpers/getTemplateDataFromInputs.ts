import { InputFields } from "./getAllInputsFromForm";
import { AffirmationFieldList, fieldLists } from "./fieldLists";
import { YesNoMap } from "./fieldLists/common";
import { CNIFieldList } from "./fieldLists/cni";
import { Errors } from "./buildEmailData";

export type AffirmationTemplateData = Record<AffirmationFieldList, string>;
export type CNITemplateData = Record<CNIFieldList, string>;

export interface TemplateData {
  templateVars: Partial<AffirmationTemplateData | CNITemplateData>;
  uploads: {
    [key: string]: string;
  };
}

export function getTemplateDataFromInputs(inputs: InputFields, formType: "cni" | "affirmation"): TemplateData | Errors {
  const formFields = fieldLists[formType];
  let templateData: TemplateData = {
    templateVars: {},
    uploads: {},
  };
  for (const field of formFields) {
    if (!inputs[field]) {
      return {
        errors: new Error(`Required field was missing: ${field}`),
      };
    }
    let answer = inputs[field].answer;
    if (inputs[field].type === "uploadField") {
      templateData.uploads[field] = inputs[field].answer as string;
      continue;
    }
    if (inputs[field].type === "yesNoField") {
      answer = YesNoMap[inputs[field].answer?.toString() ?? "false"];
    }
    templateData.templateVars[field] = answer;
  }
  return templateData;
}
