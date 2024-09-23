import * as additionalContexts from "./additionalContexts.json";

export function getPostForMarriage(country: string, post?: string) {
  return post ?? additionalContexts.marriage.countries?.[country]?.post;
}

export function getPostForCertifyCopy(country: string, post?: string) {
  return post ?? additionalContexts.certifyCopy.countries?.[country]?.post;
}
