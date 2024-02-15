import * as additionalContexts from "./../additionalContexts.json";
import config from "config";
const POST_EMAILS = config.get("postEmails");
console.log(POST_EMAILS);
export function getPostEmailAddress(country: string, post?: string) {
  let emailAddress;
  console.log(country, post);

  if (post) {
    emailAddress = additionalContexts.posts?.[post]?.emailAddress;
  }

  const countryEmailAddress = additionalContexts.countries?.[country]?.emailAddress;
  emailAddress ??= countryEmailAddress ?? config.get("submissionAddress");

  return emailAddress;
}
