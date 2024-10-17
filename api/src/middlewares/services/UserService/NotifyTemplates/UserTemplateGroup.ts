import { AnswersHashMap } from "../../../../types/AnswersHashMap";
import { FormType, PayMetadata } from "../../../../types/FormDataBody";

type getTemplateParams = {
  answers: AnswersHashMap;
  metadata: { reference: string; payment?: PayMetadata; type: FormType; postal?: boolean };
};

type Builder = (
  data: getTemplateParams["answers"],
  metadata: getTemplateParams["metadata"]
) => {
  [key: string]: string | boolean | undefined;
};

export interface UserTemplateGroup {
  getTemplate: (data: getTemplateParams) => {
    template: string;
    personalisationBuilder: Builder;
  };
}
