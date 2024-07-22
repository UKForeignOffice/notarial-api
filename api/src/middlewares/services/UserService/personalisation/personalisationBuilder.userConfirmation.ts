import * as additionalContexts from "./../../utils/additionalContexts.json";
import { getPost } from "../../utils/getPost";
import { AnswersHashMap } from "../../../../types/AnswersHashMap";
import { FormType, PayMetadata } from "../../../../types/FormDataBody";
import { ApplicationError } from "../../../../ApplicationError";

const personalisationTypeMap = {
  affirmation: getAffirmationPersonalisations,
  cni: getCNIPersonalisations,
};

export function buildUserConfirmationPersonalisation(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type?: FormType }) {
  const isSuccessfulPayment = metadata.payment?.state?.status === "success" ?? false;

  if (!answers) {
    throw new ApplicationError("WEBHOOK", "VALIDATION", 500, "Fields are empty");
  }
  const additionalPersonalisations = personalisationTypeMap[metadata.type as string]?.(answers) ?? {};
  // const docsList = buildUserConfirmationDocsList(answers, metadata.type);
  const country = answers["country"] as string;
  const post = answers["post"] as string;

  const additionalContext = {
    ...(additionalContexts.countries[country] ?? {}),
    ...(additionalContexts.posts[post] ?? additionalContexts.countries[country].post ?? {}),
  };

  return {
    firstName: answers.firstName,
    post: getPost(country, post),
    country,
    bookingLink: additionalContext.bookingLink,
    localRequirements: additionalContext.localRequirements,
    civilPartnership: additionalContext.civilPartnership,
    reference: metadata.reference,
    confirmationDelay: additionalContext.confirmationDelay ?? "2 weeks",
    notPaid: !isSuccessfulPayment,
    ...additionalPersonalisations,
    additionalDocs: additionalContext.additionalDocs ?? "",
  };
}

export function getAffirmationPersonalisations(fields: AnswersHashMap) {
  return {
    previouslyMarried: fields.maritalStatus !== "Never married",
    religious: fields.oathType === "Religious",
  };
}

export function getCNIPersonalisations(fields: AnswersHashMap) {
  return {
    livesInCountry: fields.livesInCountry === true,
    livesAbroad: !fields.livesInCountry,
    previouslyMarried: fields.maritalStatus !== "Never married",
    religious: fields.oathType === "Religious",
  };
}

// export function buildUserConfirmationDocsList(fields: AnswersHashMap, type?: FormType) {
//   if (!fields) {
//     throw new ApplicationError("WEBHOOK", "VALIDATION", 500, "Fields are empty");
//   }
//
//   const docsList = ["your UK passport", "your partner’s passport or national identity card"];
//
//   // for cni applications, proof of address is only required if the user lives in the country. For affirmation applications, proof of address is always required
//   if (type === "affirmation" || (type === "cni" && fields.livesInCountry)) {
//     docsList.splice(1, 0, "proof of address – you must use your residence permit if the country you live in issues these");
//   }
//
//   // for cnis, the user needs to provide proof they have stayed in the country for 3 days. For contextual reasons, this should appear below the proof of address doc
//   if (type === "cni" && !fields.livesInCountry) {
//     docsList.splice(1, 0, "proof you’ve been staying in the country for 3 whole days before your appointment – if this is not shown on your proof of address");
//   }
//
//   // for affirmations, users need to provide their birth certificate. For contextual reasons, this should appear next to the user's passport
//   if (type === "affirmation") {
//     docsList.splice(1, 0, "your birth certificate");
//   }
//
//   if (fields.maritalStatus && fields.maritalStatus !== "Never married") {
//     docsList.push(`${previousMarriageDocs[fields.maritalStatus as string]}`);
//   }
//   if (fields.oathType === "Religious") {
//     docsList.push("religious book of your faith to swear upon");
//   }
//   const country = fields.country as string;
//   const additionalDocs = additionalContexts.countries[country]?.additionalDocs ?? [];
//   docsList.push(...additionalDocs);
//   return docsList.map((doc) => `* ${doc}`).join("\n");
// }
