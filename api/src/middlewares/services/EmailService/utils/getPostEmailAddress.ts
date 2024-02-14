import * as additionalContexts from "./../additionalContexts.json";
import config from "config";

export function getPostEmailAddress(country: string, post?: string) {
  let emailAddress;

  if (post) {
    emailAddress = additionalContexts.posts?.[post]?.emailAddress;
  }

  const countryEmailAddress = additionalContexts.countries?.[country]?.emailAddress;
  emailAddress ??= countryEmailAddress ?? config.get("submissionEmail");

  return emailAddress;
}
