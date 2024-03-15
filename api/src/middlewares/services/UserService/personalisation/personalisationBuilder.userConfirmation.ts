import * as additionalContexts from "./../../utils/additionalContexts.json";
import { getPost } from "../../utils/getPost";
import { AnswersHashMap } from "../../../../types/AnswersHashMap";
import { PayMetadata } from "../../../../types/FormDataBody";
import { ApplicationError } from "../../../../ApplicationError";

const previousMarriageDocs = {
  Divorced: "decree absolute",
  "Dissolved civil partner": "final order",
  Widowed: "late partner's death certificate",
  "Surviving civil partner": "late partner's death certificate",
  Annulled: "decree of nullity",
};

export function buildUserConfirmationPersonalisation(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata }) {
  const isSuccessfulPayment = metadata.payment?.state?.status === "success" ?? false;
  const docsList = buildUserConfirmationDocsList(answers, isSuccessfulPayment);
  const country = answers["country"] as string;
  const post = answers["post"] as string;
  const nameChangedMoreThanOnce =
    answers["nameChangedByDeedPoll"] === "name changed more than once" || answers["nameChangedByMarriage"] === "name changed more than once";

  const additionalContext = {
    ...(additionalContexts.countries[country] ?? {}),
    ...(additionalContexts.posts[post] ?? additionalContexts.countries[country].post ?? {}),
  };

  return {
    firstName: answers.firstName,
    post: getPost(country, post),
    docsList,
    nameChangedMoreThanOnce,
    country,
    bookingLink: additionalContext.bookingLink,
    localRequirements: additionalContext.localRequirements,
    civilPartnership: additionalContext.civilPartnership,
    reference: metadata.reference,
    confirmationDelay: additionalContext.confirmationDelay ?? "2 weeks",
    duration: additionalContext.duration,
    postAddress: additionalContext.postAddress,
  };
}

export function buildUserConfirmationDocsList(fields: AnswersHashMap, paid) {
  if (!fields) {
    throw new ApplicationError("WEBHOOK", "VALIDATION", 500, "Fields are empty");
  }

  const docsList = ["your UK passport", "your birth certificate", "proof of address", "your partner’s passport or national identity card"];
  if (fields.maritalStatus && fields.maritalStatus !== "Never married") {
    docsList.push(`${previousMarriageDocs[fields.maritalStatus as string]}`);
  }
  if (fields.oathType === "affidavit") {
    docsList.push("religious book of your faith to swear upon");
  }
  if (!paid) {
    //TODO:- should this be in the template itself?
    const price = fields.certifyPassport ? "£75" : "£50";
    docsList.push(`the equivalent of ${price} in the local currency`);
  }
  const country = fields.country as string;
  const additionalDocs = additionalContexts.countries[country]?.additionalDocs ?? [];
  docsList.push(...additionalDocs);
  return docsList.map((doc) => `* ${doc}`).join("\n");
}
