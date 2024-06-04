import * as additionalContexts from "./../../utils/additionalContexts.json";
import { getPost } from "../../utils/getPost";
import { AnswersHashMap } from "../../../../types/AnswersHashMap";
import { FormType, PayMetadata } from "../../../../types/FormDataBody";
import { ApplicationError } from "../../../../ApplicationError";

const previousMarriageDocs = {
  Divorced: "decree absolute",
  "Dissolved civil partner": "final order",
  Widowed: "late partner's death certificate",
  "Surviving civil partner": "late partner's death certificate",
  Annulled: "decree of nullity",
};

export function buildUserConfirmationPersonalisation(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type?: FormType }) {
  const isSuccessfulPayment = metadata.payment?.state?.status === "success" ?? false;
  const docsList = buildUserConfirmationDocsList(answers, metadata.type);
  const country = answers["country"] as string;
  const post = answers["post"] as string;

  const additionalContext = {
    ...(additionalContexts.countries[country] ?? {}),
    ...(additionalContexts.posts[post] ?? additionalContexts.countries[country].post ?? {}),
  };

  return {
    firstName: answers.firstName,
    post: getPost(country, post),
    docsList,
    country,
    bookingLink: additionalContext.bookingLink,
    localRequirements: additionalContext.localRequirements,
    civilPartnership: additionalContext.civilPartnership,
    reference: metadata.reference,
    confirmationDelay: additionalContext.confirmationDelay ?? "2 weeks",
    notPaid: !isSuccessfulPayment,
  };
}

export function buildUserConfirmationDocsList(fields: AnswersHashMap, type?: FormType) {
  if (!fields) {
    throw new ApplicationError("WEBHOOK", "VALIDATION", 500, "Fields are empty");
  }

  const docsList = ["your UK passport", "your birth certificate", "proof of address", "your partner’s passport or national identity card"];
  if (type === "cni") {
    docsList.splice(3, 0, "proof you’ve been staying in the country for 3 whole days before your appointment – if this is not shown on your proof of address");
  }
  if (fields.maritalStatus && fields.maritalStatus !== "Never married") {
    docsList.push(`${previousMarriageDocs[fields.maritalStatus as string]}`);
  }
  if (fields.oathType === "affidavit") {
    docsList.push("religious book of your faith to swear upon");
  }
  const country = fields.country as string;
  const additionalDocs = additionalContexts.countries[country]?.additionalDocs ?? [];
  docsList.push(...additionalDocs);
  return docsList.map((doc) => `* ${doc}`).join("\n");
}
